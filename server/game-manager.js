// server/game-manager.js
const GameInstance = require('./game-instance'); // Manages a single game match

/**
 * Manages the overall flow of players joining, waiting, and starting games.
 * Handles storing player data (including names, readiness), matchmaking,
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

        console.log("[GameManager] Initialized.");
    }

    /**
     * Adds a newly connected player to the waiting list with default values.
     * Called by socket-handler upon connection.
     * @param {SocketIO.Socket} socket - The socket object for the connected player.
     */
    addPlayer(socket) {
        const initialName = `Player_${socket.id.substring(0, 4)}`;
        console.log(`[GameManager] Player ${socket.id} (${initialName}) connected and is waiting.`);
        // Add player to the pending list with default name and not ready status.
        this.pendingPlayers.set(socket.id, {
            socket: socket,
            code: null,
            appearance: 'default',
            name: initialName, // Assign initial default name
            isReady: false // Player is not ready initially
        });
        // Note: lobbyEvent ('Player connected') and broadcastLobbyStatus() are called from socket-handler immediately after addPlayer
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

        // Player not found or name missing
        // console.warn(`[GameManager] Failed to find name for socket ID: ${socketId}`); // Optional: Reduce noise
        return null;
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
            console.log(`[GameManager] Received data from unknown or already in-game player: ${socketId}`);
            return; // Ignore if player isn't in the pending list
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

        // Note: broadcastLobbyStatus() is called from socket-handler after this method completes
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

                // If player becomes ready (e.g., future "ready" button without code submit), try to start match
                if (isReady) {
                    this._tryStartMatch();
                }

                 // Broadcast updated lobby status regardless of state change direction
                 this.broadcastLobbyStatus();
            }
        } else {
            console.warn(`[GameManager] Tried to set ready status for unknown pending player ${socketId}`);
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

            // Select the players for the new game (e.g., take the first N ready players found)
            const playersForGame = readyPlayers.slice(0, requiredPlayers);

            // Remove these selected players from the pending list *before* creating the game instance
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));

            // Create and start the new game instance
            this.createGame(playersForGame); // Pass the array of player data objects
        } else {
            // Not enough players ready, just log status
            console.log(`[GameManager] Waiting for more players. ${readyPlayers.length}/${requiredPlayers} ready.`);
            // Status will be updated via broadcastLobbyStatus called from socket-handler or setPlayerReadyStatus
        }
    }

    /**
     * Creates a new GameInstance, adds it to the active games list,
     * maps players to the game, starts the game loop, and emits lobby event.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data objects for the new game.
     */
    createGame(playersData) {
        const gameId = `game-${this.gameIdCounter++}`;
        const playerInfo = playersData.map(p => `${p.name}(${p.socket.id.substring(0,4)})`).join(', ');
        console.log(`[GameManager] Creating game ${gameId} for players: ${playerInfo}`);

        // Emit Lobby Event: Game Starting
        const playerNames = playersData.map(p => p.name).join(' vs ');
        this.io.emit('lobbyEvent', { message: `Game starting: ${playerNames}!` });

        try {
            // Create the GameInstance, passing the necessary data and the gameOver callback method reference
            const gameInstance = new GameInstance(gameId, this.io, playersData, (winnerData) => {
                this.handleGameOverEvent(winnerData);
            });

            // Store the active game instance
            this.activeGames.set(gameId, gameInstance);

            // Map each player's socket ID to this game ID and notify them individually
            playersData.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);

                // Notify the client that their specific game is starting
                player.socket.emit('gameStart', {
                    gameId: gameId,
                    players: playersData.map(p => ({ // Send info about all players in this match
                        id: p.socket.id,
                        name: p.name,
                        appearance: p.appearance
                     }))
                });
                console.log(`[GameManager] Notified player ${player.name} that game ${gameId} is starting.`);
            });

            // Start the simulation loop for the new game instance
            gameInstance.startGameLoop();

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId}:`, error);
            // Emit Lobby Event: Game Creation Failed
            this.io.emit('lobbyEvent', { message: `Failed to start game for ${playerInfo}. Please try again.`, type: 'error' }); // Add type for styling
            // Handle game creation error: Put players back in pending, mark as not ready
            playersData.forEach(player => {
                 player.isReady = false; // Ensure they aren't immediately picked again if error was transient
                 this.pendingPlayers.set(player.socket.id, player); // Put back in the queue
                 // Notify player individually about the error
                 player.socket.emit('gameError', { message: "Failed to create game instance. Please Ready Up again." });
            });
             // Broadcast updated lobby status after failed game creation and putting players back
             this.broadcastLobbyStatus();
        }
    }

    /**
     * Handles the game over event triggered by a GameInstance callback.
     * Emits a lobby event announcing the winner.
     * @param {object} winnerData - Object containing winner details { winnerId, winnerName, reason }.
     */
    handleGameOverEvent(winnerData) {
        const winnerName = winnerData.winnerName || 'No one';
        const reason = winnerData.reason || 'Match ended.';
        console.log(`[GameManager] Received game over event. Winner: ${winnerName}`);
        // Broadcast game over message to everyone in the lobby
        this.io.emit('lobbyEvent', { message: `Game over! Winner: ${winnerName}. (${reason})` });
        // Lobby status automatically updates as players disconnect or re-ready for the next game
    }

    /**
     * Removes a disconnected or leaving player from the system.
     * Handles removing them from pending lists or active games, and updates matchmaking state.
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
                console.log(`[GameManager] Removing player ${playerName || socketId} from active game ${gameId}.`);
                game.removePlayer(socketId); // Tell the GameInstance to handle internal cleanup

                // If the game becomes empty after removal, clean up the game instance itself.
                if (game.isEmpty()) {
                    console.log(`[GameManager] Game ${gameId} is now empty. Destroying game instance.`);
                    game.stopGameLoop(); // Ensure loop is stopped before deleting reference
                    this.activeGames.delete(gameId);
                }
            } else {
                 // Should not happen if map is consistent, but good to log.
                 console.warn(`[GameManager] Player ${playerName || socketId} mapped to non-existent game ${gameId}. Cleaning up map.`);
            }
            // Remove the player from the game map regardless.
            this.playerGameMap.delete(socketId);
        }

        // Log removal type and potentially re-evaluate matchmaking
        if (wasPending) {
            console.log(`[GameManager] Player ${playerName || socketId} removed from pending list.`);
             // If a waiting/ready player leaves, check if a different game can now start
             this._tryStartMatch();
        } else if (gameId) {
             console.log(`[GameManager] Player ${playerName || socketId} removed from active game ${gameId}.`);
        } else {
             // Player was neither pending nor in the active game map (e.g., connected but never readied up?)
             console.log(`[GameManager] Removed player ${playerName || socketId} (was not pending or in active game map).`);
        }

        // Note: broadcastLobbyStatus is called from socket-handler *after* removePlayer completes
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

} // End GameManager Class

module.exports = GameManager;