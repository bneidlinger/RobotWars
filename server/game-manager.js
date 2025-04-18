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
        // Note: lobbyEvent and broadcastLobbyStatus() called from socket-handler after addPlayer
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

        // Check active games
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            // Access the name stored within the GameInstance's players map value
            const activePlayerData = game?.players?.get(socketId);
            if (activePlayerData && activePlayerData.name) {
                return activePlayerData.name;
            }
            // Fallback: Check GameInstance's separate name map if it exists
            if (game?.playerNames?.get(socketId)) {
                return game.playerNames.get(socketId);
            }
        }

        // Player not found or name missing
        // console.warn(`[GameManager] Failed to find name for socket ID: ${socketId}`); // Optional: make less noisy
        return null;
    }


    /**
     * Handles receiving code, appearance, and name data from a player.
     * Updates the player's status to ready and attempts matchmaking.
     * @param {string} socketId - The ID of the player submitting data.
     * @param {string} code - The robot AI code submitted by the player.
     * @param {string} appearance - The appearance identifier chosen by the player.
     * @param {string} name - The sanitized name provided by the player.
     */
    handlePlayerCode(socketId, code, appearance, name) {
        const playerData = this.pendingPlayers.get(socketId);

        if (!playerData) {
            console.log(`[GameManager] Received data from unknown or already in-game player: ${socketId}`);
            return;
        }

        // Update player data *before* emitting events using the new name
        playerData.code = code;
        playerData.appearance = (typeof appearance === 'string' && appearance.trim()) ? appearance : 'default';
        playerData.name = name; // Store the sanitized name
        playerData.isReady = true; // Mark player as ready upon code submission

        console.log(`[GameManager] Player ${playerData.name} (${socketId}) submitted code and is Ready.`);

        // Emit Lobby Event: Player is Ready
        this.io.emit('lobbyEvent', { message: `Player ${playerData.name} is ready!` });

        // Attempt to start match immediately after player readies up
        this._tryStartMatch();

        // Broadcast updated status (will be called by socket-handler after this finishes)
        // this.broadcastLobbyStatus(); // Redundant if called in socket-handler
    }

    /**
     * Internal method to check if enough ready players exist and start a game.
     */
    _tryStartMatch() {
        const readyPlayers = Array.from(this.pendingPlayers.values())
                                .filter(p => p.isReady === true);

        const requiredPlayers = 2; // Configurable: Number of players needed for a match
        if (readyPlayers.length >= requiredPlayers) {
            console.log(`[GameManager] ${readyPlayers.length}/${requiredPlayers} players ready. Starting new game...`);

            // Select the players for the new game (e.g., first N ready players)
            const playersForGame = readyPlayers.slice(0, requiredPlayers);

            // Remove these players from the pending list *before* creating game
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));

            // Create and start the new game instance
            this.createGame(playersForGame); // Pass the array of player data objects
        } else {
            // Not enough players ready, just log status
            console.log(`[GameManager] Waiting for more players. ${readyPlayers.length}/${requiredPlayers} ready.`);
            // Status will be updated via broadcastLobbyStatus called externally
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
            // Create the GameInstance, passing the necessary data and the gameOver callback
            const gameInstance = new GameInstance(gameId, this.io, playersData, (winnerData) => {
                this.handleGameOverEvent(winnerData); // Pass reference to the handler method
            });

            this.activeGames.set(gameId, gameInstance);

            // Map each player's socket ID to this game ID and notify them individually
            playersData.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);

                // Notify the client that their game is starting
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

            gameInstance.startGameLoop(); // Start the simulation

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId}:`, error);
            // Emit Lobby Event: Game Creation Failed
            this.io.emit('lobbyEvent', { message: `Failed to start game for ${playerInfo}. Please try again.`, type: 'error' }); // Add type
            // Handle game creation error: Put players back in pending, mark as not ready
            playersData.forEach(player => {
                 player.isReady = false; // Ensure they aren't immediately picked again
                 this.pendingPlayers.set(player.socket.id, player); // Put back in the queue
                 player.socket.emit('gameError', { message: "Failed to create game instance. Please Ready Up again." });
            });
             // Broadcast updated lobby status after failed game creation
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
        this.io.emit('lobbyEvent', { message: `Game over! Winner: ${winnerName}. (${reason})` });
        // Lobby status automatically updates as players disconnect or re-ready
        // We don't need to explicitly call broadcastLobbyStatus here unless game end changes readiness
    }

    /**
     * Removes a disconnected or leaving player from the system.
     * Handles removing them from pending lists or active games.
     * @param {string} socketId - The ID of the player's socket.
     */
    removePlayer(socketId) {
        const playerName = this.getPlayerName(socketId); // Get name before removing data
        const playerWasPending = this.pendingPlayers.has(socketId);

        // Remove from pending list if they were waiting.
        const wasPending = this.pendingPlayers.delete(socketId);

        // Check if the player was in an active game.
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game) {
                console.log(`[GameManager] Removing player ${playerName || socketId} from active game ${gameId}.`);
                game.removePlayer(socketId); // Tell the GameInstance

                // If the game becomes empty after removal, clean it up.
                if (game.isEmpty()) {
                    console.log(`[GameManager] Game ${gameId} is now empty. Destroying game instance.`);
                    game.stopGameLoop(); // Ensure loop is stopped before deleting
                    this.activeGames.delete(gameId);
                }
            } else {
                 console.warn(`[GameManager] Player ${playerName || socketId} mapped to non-existent game ${gameId}. Cleaning up map.`);
            }
            this.playerGameMap.delete(socketId); // Remove player from game map regardless
        }

        // Log removal type
        if (wasPending) {
            console.log(`[GameManager] Player ${playerName || socketId} removed from pending list.`);
             // If a waiting/ready player leaves, check if a different game can now start
             this._tryStartMatch();
        } else if (gameId) {
             console.log(`[GameManager] Player ${playerName || socketId} removed from active game ${gameId}.`);
        } else {
             console.log(`[GameManager] Removed player ${playerName || socketId} (was not pending or in active game map).`);
        }

        // Note: broadcastLobbyStatus is called from socket-handler after removePlayer completes
    }

    /**
     * Calculates the current lobby status (waiting/ready counts) and broadcasts it to all clients.
     */
    broadcastLobbyStatus() {
        const totalWaiting = this.pendingPlayers.size;
        // Count only players in the pending list who are marked as ready
        const readyCount = Array.from(this.pendingPlayers.values()).filter(p => p.isReady).length;

        const statusData = {
            waiting: totalWaiting, // Total players not in an active game
            ready: readyCount      // Players in pending list marked as ready
        };

        // console.log("[GameManager] Broadcasting Lobby Status:", statusData); // Optional debug log
        this.io.emit('lobbyStatusUpdate', statusData);
    }


    /**
     * Routes an action received from a player to the correct game instance.
     * (Currently not used with server-side interpreter).
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

    // --- TODO: Methods for explicit Ready system (Phase 2 Priority 3) ---
    // setPlayerReadyStatus(socketId, isReady) {
    //     const playerData = this.pendingPlayers.get(socketId);
    //     if (playerData) {
    //         playerData.isReady = isReady;
    //         this.io.emit('lobbyEvent', { message: `Player ${playerData.name} is ${isReady ? 'now ready' : 'no longer ready'}.` });
    //         if (isReady) {
    //             this._tryStartMatch(); // Attempt match if player becomes ready
    //         }
    //         this.broadcastLobbyStatus();
    //     }
    // }

} // End GameManager Class

module.exports = GameManager;
