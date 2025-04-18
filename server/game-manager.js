// server/game-manager.js
const GameInstance = require('./game-instance'); // Manages a single game match
const fs = require('fs'); // Needed to read the dummy bot AI file
const path = require('path'); // Needed to construct the path to the dummy bot AI file

/**
 * Manages the overall flow of players joining, waiting, and starting games.
 * Handles storing player data (including names, readiness), matchmaking,
 * game naming, tracking active/finished games, cleaning up old instances,
 * starting single-player test games, handling self-destruct requests, // <-- Added Self-Destruct
 * transitioning lobby players to spectators, moving participants back to lobby,
 * broadcasting game history,
 * and broadcasting lobby events and status updates.
 */
class GameManager {
    /**
     * Creates a GameManager instance.
     * @param {SocketIO.Server} io - The main Socket.IO server instance for communication.
     */
    constructor(io) {
        this.io = io; // Socket.IO server instance

        // Stores players waiting to join a game.
        // Key: socket.id
        // Value: { socket: SocketIO.Socket, code: string | null, appearance: string, name: string, isReady: boolean }
        this.pendingPlayers = new Map();

        // Stores active game instances.
        // Key: gameId (string)
        // Value: GameInstance object
        this.activeGames = new Map();

        // Maps a player's socket ID to the game ID they are currently in.
        // Key: socket.id
        // Value: gameId (string)
        this.playerGameMap = new Map();

        // Simple counter to generate unique game IDs.
        this.gameIdCounter = 0;

        // --- Added for Game Tracking (Phase 3, P2) ---
        // Optional: Stores recently completed games (volatile)
        // Key: gameId, Value: {name, winnerName, players: [{id, name}], endTime}
        this.recentlyCompletedGames = new Map();
        this.maxCompletedGames = 10; // Limit history size
        // --- End Game Tracking ---

        // --- Added for Test Mode ---
        // Simple hardcoded AI for the dummy bot
        try {
             this.dummyBotCode = fs.readFileSync(path.join(__dirname, 'dummy-bot-ai.js'), 'utf8');
             console.log("[GameManager] Dummy bot AI loaded successfully.");
        } catch (err) {
             console.error("[GameManager] FAILED TO LOAD dummy-bot-ai.js:", err);
             this.dummyBotCode = "// Dummy Bot AI Load Failed\nconsole.log('AI Load Error!'); robot.drive(0,0);"; // Fallback AI
        }
        // --- End Test Mode ---

        console.log("[GameManager] Initialized.");
    }

    /**
     * Adds a newly connected player to the waiting list with default values.
     * Called by socket-handler upon connection *if no games are active*,
     * OR when moving spectators/participants back to lobby state.
     * @param {SocketIO.Socket} socket - The socket object for the connected player.
     */
    addPlayer(socket) {
        // Avoid adding if already pending (e.g., multiple moves during cleanup)
        if (this.pendingPlayers.has(socket.id)) {
            // console.log(`[GameManager] Player ${socket.id} is already pending. Skipping add.`); // Optional Log
            return;
        }
        // Try to retain existing name if available (e.g. from Controls state or previous game)
        // Keep simple for now: assign default or last known name if easy.
        const initialName = `Player_${socket.id.substring(0, 4)}`; // Default for now
        console.log(`[GameManager] Adding player ${socket.id} (${initialName}) back to pending list.`);
        // Add player to the pending list with default name and not ready status.
        this.pendingPlayers.set(socket.id, {
            socket: socket,
            code: null, // Code needs resubmission
            appearance: 'default', // Appearance might need reset client-side or resubmission
            name: initialName, // Use default - client should retain and resubmit on ready
            isReady: false // Player is NOT ready initially when returning to lobby
        });
    }

    /**
     * Generates a unique, thematic name for a new game.
     * @returns {string} A generated game name (e.g., "Dimension C-137").
     */
    generateGameName() {
        // Simple sequential naming, can be expanded later
        const baseId = 137 + this.gameIdCounter; // R&M style starting point
        return `Sector Z-${baseId}`;
        // Alternative: `Quadrant ${String.fromCharCode(65 + (this.gameIdCounter % 26))}-${Math.floor(this.gameIdCounter / 26) + 1}`
    }


    /**
     * Retrieves the name of a player based on their socket ID.
     * Checks both pending players and players in active games.
     * @param {string} socketId - The ID of the player's socket.
     * @returns {string | null} The player's name, or null if not found.
     */
    getPlayerName(socketId) {
        // Check pending players first
        const pendingData = this.pendingPlayers.get(socketId);
        if (pendingData && pendingData.name) {
            return pendingData.name;
        }

        // Check active games by looking up the game ID, then the game instance, then the player data within it
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            // Access the name stored within the GameInstance's players map value
            const activePlayerData = game?.players?.get(socketId);
            if (activePlayerData && activePlayerData.name) {
                return activePlayerData.name;
            }
            // Fallback: Check GameInstance's separate name map if implementation uses it
            if (game?.playerNames?.get(socketId)) {
                return game.playerNames.get(socketId);
            }
        }

        return null; // Player not found or name missing
    }


    /**
     * Handles receiving code, appearance, and name data from a player upon "Ready Up".
     * Updates the player's status to ready and attempts matchmaking.
     * Called by socket-handler when 'submitPlayerData' is received.
     * @param {string} socketId - The ID of the player submitting data.
     * @param {string} code - The robot AI code submitted by the player.
     * @param {string} appearance - The appearance identifier chosen by the player.
     * @param {string} name - The sanitized name provided by the player.
     */
    handlePlayerCode(socketId, code, appearance, name) {
        const playerData = this.pendingPlayers.get(socketId);

        if (!playerData) {
            // This check now correctly prevents submission if player is in playerGameMap OR not in pendingPlayers
            console.log(`[GameManager] Received data from non-pending player: ${socketId}. Ignoring.`);
            // Server should have sent error message via socket-handler check
            return;
        }

        // Update player data *before* emitting events using the potentially new name
        playerData.code = code;
        playerData.appearance = (typeof appearance === 'string' && appearance.trim()) ? appearance : 'default';
        playerData.name = name; // Store the sanitized name
        playerData.isReady = true; // Mark player as ready upon code submission

        console.log(`[GameManager] Player ${playerData.name} (${socketId}) submitted code and is Ready.`);

        // Emit Lobby Event: Player is Ready
        this.io.emit('lobbyEvent', { message: `Player ${playerData.name} is ready!` });

        // Attempt to start match immediately after player readies up
        this._tryStartMatch();

        // Broadcast lobby status after attempting match start
        // (Moved from socket-handler to ensure it happens after _tryStartMatch completes)
        this.broadcastLobbyStatus();
    }

    /**
     * Sets the ready status for a player in the pending list.
     * Called by socket-handler when 'playerUnready' is received.
     * @param {string} socketId - The player's socket ID.
     * @param {boolean} isReady - The desired ready state (typically false for unready).
     */
    setPlayerReadyStatus(socketId, isReady) {
        const playerData = this.pendingPlayers.get(socketId);
        if (playerData) {
            // Only update and broadcast if the state actually changes
            if (playerData.isReady !== isReady) {
                playerData.isReady = isReady;
                console.log(`[GameManager] Player ${playerData.name} (${socketId}) status set to ${isReady ? 'Ready' : 'Not Ready'}.`);

                // Emit lobby event about the change
                this.io.emit('lobbyEvent', { message: `Player ${playerData.name} is ${isReady ? 'now ready' : 'no longer ready'}.` });

                // If player becomes ready, try to start match
                if (isReady) {
                    this._tryStartMatch();
                }
                 // Broadcast updated lobby status regardless of state change direction
                 this.broadcastLobbyStatus();
            }
        } else {
            // This might happen if player unreadies exactly as game starts/ends, ignore.
            console.warn(`[GameManager] Tried to set ready status for unknown pending player ${socketId}. Ignoring.`);
        }
    }


    /**
     * Internal method to check if enough ready players exist in the pending list and start a game if possible.
     * Called after a player readies up, becomes unready, or disconnects while pending.
     */
    _tryStartMatch() {
        // Find all players in the pending list currently marked as ready.
        const readyPlayers = Array.from(this.pendingPlayers.values())
                                .filter(p => p.isReady === true);

        const requiredPlayers = 2; // Configurable: Number of players needed for a match
        if (readyPlayers.length >= requiredPlayers) {
            console.log(`[GameManager] ${readyPlayers.length}/${requiredPlayers} players ready. Starting new game...`);

            // Select the players for the new game
            const playersForGame = readyPlayers.slice(0, requiredPlayers);

            // Remove these selected players from the pending list *before* creating the game instance
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));

            // Create and start the new game instance (handles moving others to spectate)
            this.createGame(playersForGame);

            // Broadcast the new lobby status (pending list should now be smaller or empty)
            // (Moved broadcast call to end of createGame and handlePlayerCode to ensure it runs after state changes)
        } else {
            // Not enough players ready, just log status
            // console.log(`[GameManager] Waiting for more players. ${readyPlayers.length}/${requiredPlayers} ready.`); // Optional log
        }
    }

    /**
     * Creates a new GameInstance, adds it to the active games list,
     * maps players to the game, starts the game loop, transitions remaining lobby players
     * to spectators, emits lobby events, and broadcasts lobby status.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data objects for the new game.
     */
    createGame(playersData) {
        const gameId = `game-${this.gameIdCounter++}`;
        const gameName = this.generateGameName();
        const playerInfo = playersData.map(p => `${p.name}(${p.socket.id.substring(0,4)})`).join(', ');
        console.log(`[GameManager] Creating game ${gameId} ('${gameName}') for players: ${playerInfo}`);

        const playerNames = playersData.map(p => p.name).join(' vs ');
        this.io.emit('lobbyEvent', { message: `Game '${gameName}' starting: ${playerNames}!` });

        let gameInstance;

        try {
            // Create the GameInstance
            gameInstance = new GameInstance(
                gameId, this.io, playersData,
                (endedGameId, winnerData) => { this.handleGameOverEvent(endedGameId, winnerData); },
                gameName
            );

            // Store the active game instance
            this.activeGames.set(gameId, gameInstance);

            // Map participants to the game and notify them
            playersData.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);
                 if (player.socket.connected) { // Check connection before emitting
                     player.socket.emit('gameStart', {
                         gameId: gameId, gameName: gameName,
                         players: playersData.map(p => ({ id: p.socket.id, name: p.name, appearance: p.appearance }))
                     });
                     console.log(`[GameManager] Notified player ${player.name} that game ${gameId} ('${gameName}') is starting.`);
                 } else {
                     console.warn(`[GameManager] Player ${player.name} disconnected before gameStart emit.`);
                 }
            });

            // --- START: Transition remaining lobby players to spectators ---
            const spectatorRoom = `spectator-${gameId}`;
            // IMPORTANT: Create a *copy* of the values before iterating and modifying the map
            const remainingPendingPlayers = Array.from(this.pendingPlayers.values());

            if (remainingPendingPlayers.length > 0) {
                console.log(`[GameManager] Moving ${remainingPendingPlayers.length} remaining pending players to spectate game ${gameId} ('${gameName}').`);
                remainingPendingPlayers.forEach(pendingPlayer => {
                    const spectatorSocket = pendingPlayer.socket;
                    const spectatorId = spectatorSocket.id;
                    const spectatorName = pendingPlayer.name;

                    // Double-check if the player still exists in pendingPlayers before modifying
                    if (this.pendingPlayers.has(spectatorId)) {
                        if (spectatorSocket.connected) {
                             spectatorSocket.join(spectatorRoom);
                             spectatorSocket.emit('spectateStart', { gameId: gameId, gameName: gameName });
                             this.pendingPlayers.delete(spectatorId); // Remove AFTER emitting/joining
                             console.log(`[GameManager] Moved pending player ${spectatorName} (${spectatorId}) to spectate.`);
                        } else {
                             console.log(`[GameManager] Pending player ${spectatorName} (${spectatorId}) disconnected before spectate move. Removing.`);
                             this.pendingPlayers.delete(spectatorId);
                        }
                    } else {
                         console.log(`[GameManager] Player ${spectatorName} (${spectatorId}) no longer pending. Skipping spectate move.`);
                    }
                });
            }
            // --- END: Transition remaining lobby players ---

            // Start the simulation loop for the new game instance
            gameInstance.startGameLoop();

            // Broadcast lobby status AFTER game is created and players/spectators moved
            this.broadcastLobbyStatus();

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId} ('${gameName}'):`, error);
            this.io.emit('lobbyEvent', { message: `Failed to start game '${gameName}' for ${playerInfo}. Please try again.`, type: 'error' });
            // Put original players back in pending if game creation failed
            playersData.forEach(player => {
                 if (player.socket) { // Only add back real players
                     player.isReady = false; // Mark as not ready
                     this.addPlayer(player.socket); // Add back to pending list safely
                     if(player.socket.connected) {
                        player.socket.emit('gameError', { message: `Failed to create game instance '${gameName}'. Please Ready Up again.` });
                     }
                 }
            });
            // Clean up partially created game if needed
            if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
            playersData.forEach(player => {
                 if (player.socket) this.playerGameMap.delete(player.socket.id);
            });
            // Broadcast lobby status after failure handling
            this.broadcastLobbyStatus();
        }
    } // End createGame

    /**
     * Starts a single-player test game against a simple AI bot.
     * Called by socket-handler when 'requestTestGame' is received.
     * @param {SocketIO.Socket} playerSocket - The socket of the player requesting the test.
     * @param {string} playerCode - The AI code submitted by the player.
     * @param {string} playerAppearance - The appearance identifier chosen by the player.
     * @param {string} playerName - The sanitized name provided by the player.
     */
    startTestGameForPlayer(playerSocket, playerCode, playerAppearance, playerName) {
        const playerId = playerSocket.id;
        console.log(`[GameManager] Starting test game for player ${playerName} (${playerId})`);

        // 1. Remove player from the pending list
        if (!this.pendingPlayers.delete(playerId)) {
             console.warn(`[GameManager] Player ${playerName} (${playerId}) requested test game but wasn't pending. Aborting.`);
             playerSocket.emit('lobbyEvent', { message: "Cannot start test game - state conflict.", type: "error" });
             return;
        }

        // 2. Generate Game ID and Name
        const gameId = `test-${this.gameIdCounter++}`;
        // Make the name distinct
        const gameName = `Test Arena ${gameId.split('-')[1]}`; // e.g., Test Arena 0

        // 3. Prepare Player Data for GameInstance
        const playerGameData = {
            socket: playerSocket, // The real player's socket
            code: playerCode,
            appearance: playerAppearance,
            name: playerName,
            isReady: true // Mark as ready for instance logic
        };

        // 4. Prepare Dummy Bot Data
        const dummyBotId = `dummy-bot-${gameId}`;
        const dummyBotGameData = {
            socket: null, // CRUCIAL: Dummy bot has no socket
            code: this.dummyBotCode, // Hardcoded AI script from file
            appearance: 'default', // Or choose a specific one
            name: "Test Bot Alpha", // Fixed name
            isReady: true // Mark as ready
        };

        // 5. Create the GameInstance with BOTH player and dummy bot
        console.log(`[GameManager] Creating test game ${gameId} ('${gameName}')`);
        this.io.emit('lobbyEvent', { message: `Test game '${gameName}' starting for ${playerName}!` });

        try {
             const gameInstance = new GameInstance(
                 gameId,
                 this.io,
                 [playerGameData, dummyBotGameData], // Pass both to the instance
                 (endedGameId, winnerData) => {
                      // Add a flag to the winner data for client-side distinction
                      winnerData.wasTestGame = true;
                      this.handleGameOverEvent(endedGameId, winnerData);
                 },
                 gameName
             );

            this.activeGames.set(gameId, gameInstance);
            // IMPORTANT: Only map the REAL player to the game
            this.playerGameMap.set(playerId, gameId);

            // Send 'gameStart' ONLY to the requesting player's socket
            playerSocket.emit('gameStart', {
                gameId: gameId, gameName: gameName, isTestGame: true, // Add flag
                players: [ // Send info for both player and dummy
                     { id: playerId, name: playerName, appearance: playerAppearance },
                     { id: dummyBotId, name: dummyBotGameData.name, appearance: dummyBotGameData.appearance }
                ]
            });

            gameInstance.startGameLoop();
            this.broadcastLobbyStatus(); // Update lobby counts

        } catch (error) {
             console.error(`[GameManager] Error creating test game ${gameId} ('${gameName}'):`, error);
             this.io.emit('lobbyEvent', { message: `Failed to start test game '${gameName}' for ${playerName}. Please try again.`, type: 'error' });
             // Put the player back into pending if creation failed
             playerGameData.isReady = false; // Mark as not ready
             this.addPlayer(playerSocket); // Add back safely
             if(playerSocket.connected) {
                playerSocket.emit('gameError', { message: `Failed to create test game instance '${gameName}'. Please Ready Up or Test again.` });
             }
             // Clean up maps if needed
             if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
             this.playerGameMap.delete(playerId);
             this.broadcastLobbyStatus(); // Broadcast status after failure
        }
    }


    /**
     * Handles the game over event triggered by a GameInstance callback.
     * Emits lobby events, moves spectators AND participants back to the lobby,
     * cleans up player mapping, removes the game instance, logs the result,
     * and broadcasts the updated game history.
     * @param {string} gameId - The ID of the game that just ended.
     * @param {object} winnerData - Object containing winner details { winnerId, winnerName, reason, wasTestGame? }.
     */
    async handleGameOverEvent(gameId, winnerData) {
        const gameInstance = this.activeGames.get(gameId);
        const gameName = gameInstance ? gameInstance.gameName : `Game ${gameId}`;
        const isTestGame = winnerData.wasTestGame || false; // Check for the test game flag

        const winnerName = winnerData.winnerName || 'No one';
        const reason = winnerData.reason || 'Match ended.';
        console.log(`[GameManager] Received game over event for ${gameId} ('${gameName}'). Winner: ${winnerName}. TestGame: ${isTestGame}`);

        // Adjust lobby message based on game type
        const lobbyMsg = isTestGame ? `Test game '${gameName}' over! Winner: ${winnerName}. (${reason})` : `Game '${gameName}' over! Winner: ${winnerName}. (${reason})`;
        this.io.emit('lobbyEvent', { message: lobbyMsg });

        if (!gameInstance) {
            console.warn(`[GameManager] handleGameOverEvent called for ${gameId}, but instance not found. Skipping cleanup.`);
            this.broadcastLobbyStatus();
            return;
        }

        // --- Move Spectators Back to Lobby ---
        // Test games don't have spectators, but this code handles both cases safely.
        const spectatorRoom = `spectator-${gameId}`;
        try {
            const spectatorSockets = await this.io.in(spectatorRoom).fetchSockets();
            console.log(`[GameManager] Found ${spectatorSockets.length} spectators for game ${gameId}. Moving to lobby.`);
            spectatorSockets.forEach(spectatorSocket => {
                if (spectatorSocket.connected) {
                    console.log(`[GameManager] Moving spectator ${spectatorSocket.id} from room ${spectatorRoom} back to lobby.`);
                    spectatorSocket.leave(spectatorRoom); // Leave room first
                    this.addPlayer(spectatorSocket);    // Then add to pending safely
                } else {
                    console.log(`[GameManager] Spectator ${spectatorSocket.id} disconnected before move.`);
                }
            });
        } catch (err) {
             console.error(`[GameManager] Error fetching/moving spectators for ${gameId}:`, err);
        }
        // --- End Spectator Move ---

        // --- Clean up Player Mappings AND Move REAL Participants to Lobby ---
        const playerIds = Array.from(gameInstance.players.keys());
        console.log(`[GameManager] Cleaning up mappings and moving participants to lobby for game ${gameId}:`, playerIds);
        playerIds.forEach(playerId => {
            this.playerGameMap.delete(playerId); // Remove from active game map first
            console.log(`[GameManager] Removed player ${playerId} from playerGameMap.`);

            // Get the socket object for the participant
            const playerData = gameInstance.players.get(playerId);
            const playerSocket = playerData ? playerData.socket : null;

            // Add participant back to the pending list ONLY IF they have a socket AND are connected
            // This prevents trying to add the dummy bot back to the lobby.
            if (playerSocket && playerSocket.connected) {
                 console.log(`[GameManager] Adding participant ${playerId} back to pendingPlayers.`);
                 this.addPlayer(playerSocket); // Add them back to the lobby list safely
            } else if (playerSocket) { // Had a socket but disconnected
                 console.log(`[GameManager] Participant ${playerId} not found or disconnected. Cannot add back to lobby.`);
            } else {
                // This is likely the dummy bot, no socket to add back.
                console.log(`[GameManager] Participant ${playerId} (likely dummy bot) has no socket. Not adding to lobby.`);
            }
        });
        // --- End Participant Cleanup/Move ---

        // --- Optional: Log completed game ---
        // Ensure gameInstance and playerNames exist before trying to access them
        if (gameInstance && gameInstance.playerNames) {
            const completedGameData = {
                name: gameName,
                winnerName: winnerName,
                players: Array.from(gameInstance.playerNames.entries()).map(([id, name]) => ({ id, name })),
                endTime: Date.now()
            };
            // Only log non-test games to history (or add a flag to filter client-side)
            if (!isTestGame) {
                this.recentlyCompletedGames.set(gameId, completedGameData);
                while (this.recentlyCompletedGames.size > this.maxCompletedGames) {
                    const oldestGameId = this.recentlyCompletedGames.keys().next().value;
                    this.recentlyCompletedGames.delete(oldestGameId);
                    console.log(`[GameManager] Pruned oldest completed game log: ${oldestGameId}`);
                }
                console.log(`[GameManager] Logged completed game: ${gameId} ('${gameName}')`);
                 // Broadcast Updated Game History ONLY if a non-test game ended
                this.broadcastGameHistory();
            } else {
                console.log(`[GameManager] Test game ${gameId} ('${gameName}') ended. Not adding to public history.`);
            }
        } else {
            console.warn(`[GameManager] Could not log completed game ${gameId}, instance or playerNames missing.`);
        }
        // --- End Game Logging ---

        // --- Clean up Game Instance Resources & Remove ---
        try {
            if (gameInstance) gameInstance.cleanup(); // Check if instance exists before cleanup
        } catch(err) {
            console.error(`[GameManager] Error during gameInstance.cleanup() for ${gameId}:`, err);
        }
        this.activeGames.delete(gameId); // Remove from active games map AFTER cleanup
        console.log(`[GameManager] Game instance ${gameId} ('${gameName}') fully removed.`);
        // --- End Instance Cleanup ---

        // Broadcast status now that spectators AND participants are back in pending
        this.broadcastLobbyStatus();
    }

     /** Helper function to broadcast the current game history */
     broadcastGameHistory() {
         // Convert map values to an array, sort by endTime descending (newest first)
         const historyArray = Array.from(this.recentlyCompletedGames.values())
                                 // Optional: Filter out test games from history?
                                 // .filter(game => !game.name.startsWith("Test Arena")) // Already filtered during logging

                                  .sort((a, b) => b.endTime - a.endTime); // Sort newest first
         // console.log(`[GameManager] Broadcasting game history (${historyArray.length} entries).`); // Optional Log
         this.io.emit('gameHistoryUpdate', historyArray);
     }

    /**
     * Removes a disconnected or leaving player from the system.
     * Handles removing them from pending lists or active games, updates matchmaking state,
     * and cleans up game instances if they become empty due to disconnection *during* the game.
     * Called by socket-handler upon 'disconnect'.
     * @param {string} socketId - The ID of the player's socket.
     */
    removePlayer(socketId) {
        const playerName = this.getPlayerName(socketId); // Get name before removing data
        const playerWasPending = this.pendingPlayers.has(socketId);

        // Remove from pending list if they were waiting. Returns true if deleted.
        const wasPending = this.pendingPlayers.delete(socketId);

        // Check if the player was in an active game and remove them.
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game) {
                console.log(`[GameManager] Removing player ${playerName || socketId} from active game ${gameId} ('${game.gameName}') due to disconnect/leave.`);
                game.removePlayer(socketId); // Tell the GameInstance to handle internal cleanup

                // If the game becomes empty *DURING PLAY* after removal, clean up the game instance itself.
                // The GameInstance.isEmpty() method now correctly handles dummy bots.
                if (game.isEmpty()) {
                    console.log(`[GameManager] Active game ${gameId} ('${game.gameName}') has no players left after disconnect. Triggering cleanup.`);
                    // Use the existing gameOver handling which now manages dummy bots correctly
                    this.handleGameOverEvent(gameId, { winnerId: null, winnerName: 'None', reason: 'Player Disconnected', wasTestGame: game.gameName.startsWith("Test Arena") });
                    // Note: handleGameOverEvent deletes the game from activeGames
                }
            } else {
                 console.warn(`[GameManager] Player ${playerName || socketId} mapped to non-existent game ${gameId}. Cleaning up map.`);
            }
            // Remove the player from the game map regardless.
            this.playerGameMap.delete(socketId);
        }

        // Log removal type and potentially re-evaluate matchmaking if they were pending
        if (wasPending) {
            console.log(`[GameManager] Player ${playerName || socketId} removed from pending list.`);
             this._tryStartMatch();
        } else if (gameId) {
             // Logged above when calling game.removePlayer()
        } else {
             // Player was neither pending nor in the active game map (e.g., spectator disconnect)
             console.log(`[GameManager] Removed player ${playerName || socketId} (was not pending or in active game map).`);
        }

        // Lobby status will be broadcast by the calling disconnect handler
    }

    /**
     * Calculates the current lobby status (waiting/ready counts) and broadcasts it to all connected clients.
     */
    broadcastLobbyStatus() {
        const totalPending = this.pendingPlayers.size;
        // Count only players in the pending list who are marked as ready
        const readyCount = Array.from(this.pendingPlayers.values()).filter(p => p.isReady).length;

        const statusData = {
            waiting: totalPending, // Total players not in an active game
            ready: readyCount      // Players in pending list marked as ready
        };

        // console.log("[GameManager] Broadcasting Lobby Status:", statusData); // Optional debug log
        this.io.emit('lobbyStatusUpdate', statusData);
    }


    /**
     * Routes an action received from a player (during a game) to the correct game instance.
     * Placeholder - Not used in the current server-side interpreter model.
     * @param {string} socketId - The ID of the player sending the action.
     * @param {object} action - The action object sent by the client.
     */
    handlePlayerAction(socketId, action) {
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game && typeof game.queueAction === 'function') {
                game.queueAction(socketId, action); // Delegate to GameInstance
            }
        } else {
             const playerName = this.getPlayerName(socketId) || socketId;
             console.warn(`[GameManager] Received action from player ${playerName} not currently in a game.`);
        }
    }

    /**
     * Handles a self-destruct request from a player.
     * Finds the game instance and tells it to trigger the destruction.
     * @param {string} socketId - The ID of the player requesting self-destruction.
     */
    handleSelfDestruct(socketId) {
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game && typeof game.triggerSelfDestruct === 'function') {
                console.log(`[GameManager] Relaying self-destruct for ${socketId} to game ${gameId}`);
                game.triggerSelfDestruct(socketId); // Delegate to GameInstance
            } else {
                 console.warn(`[GameManager] Game instance ${gameId} not found or missing triggerSelfDestruct for player ${socketId}.`);
            }
        } // No need for else, socket-handler already warned if not in map
    }

} // End GameManager Class


module.exports = GameManager;