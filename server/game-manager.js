// server/game-manager.js
const GameInstance = require('./game-instance'); // Manages a single game match

/**
 * Manages the overall flow of players joining, waiting, and starting games.
 * Handles storing player data (including names) and basic matchmaking.
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
        // Note: broadcastLobbyStatus() is called from socket-handler after addPlayer
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
            // Access the name stored within the GameInstance's player map
            // (Assuming GameInstance constructor stores {name: ...} in its this.players map value)
            const activePlayerData = game?.players?.get(socketId);
            if (activePlayerData && activePlayerData.name) {
                return activePlayerData.name;
            }
            // Fallback: maybe GameInstance has a direct name map?
            if (game?.playerNames?.get(socketId)) {
                return game.playerNames.get(socketId);
            }
        }

        console.warn(`[GameManager] Failed to find name for socket ID: ${socketId}`);
        return null; // Player not found or name missing
    }


    /**
     * Handles receiving code, appearance, and name data from a player.
     * Updates the player's status and attempts matchmaking.
     * @param {string} socketId - The ID of the player submitting data.
     * @param {string} code - The robot AI code submitted by the player.
     * @param {string} appearance - The appearance identifier chosen by the player.
     * @param {string} name - The sanitized name provided by the player.
     */
    handlePlayerCode(socketId, code, appearance, name) {
        const playerData = this.pendingPlayers.get(socketId);

        // Ignore if the player isn't found (e.g., already in a game or disconnected).
        if (!playerData) {
            console.log(`[GameManager] Received data from unknown or already in-game player: ${socketId}`);
            return;
        }

        console.log(`[GameManager] Received data from ${socketId}: Name='${name}', Appearance='${appearance}'. Setting ready.`);

        // Update the player's data
        playerData.code = code;
        playerData.appearance = (typeof appearance === 'string' && appearance.trim()) ? appearance : 'default';
        playerData.name = name; // Store the sanitized name
        playerData.isReady = true; // Mark player as ready upon code submission

        // --- Basic Matchmaking Logic ---
        // Find all players in the pending list marked as ready.
        const readyPlayers = Array.from(this.pendingPlayers.values())
                                .filter(p => p.isReady === true);

        const requiredPlayers = 2; // TODO: Make this configurable?
        if (readyPlayers.length >= requiredPlayers) {
            console.log(`[GameManager] ${readyPlayers.length} players ready. Starting game...`);

            // Select the players for the new game (take the first N ready players).
            const playersForGame = readyPlayers.slice(0, requiredPlayers);

            // Remove these players from the pending list.
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));

            // Create and start the new game instance.
            this.createGame(playersForGame); // Pass the array of player data objects
        } else {
            console.log(`[GameManager] Waiting for more players. ${readyPlayers.length}/${requiredPlayers} ready.`);
            // broadcastLobbyStatus() is called from socket-handler after this returns
        }
    }

    /**
     * Creates a new GameInstance, adds it to the active games list,
     * maps players to the game, and starts the game loop.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string, name: string, isReady: boolean}>} playersData - Array of player data objects for the new game.
     */
    createGame(playersData) {
        const gameId = `game-${this.gameIdCounter++}`;
        const playerInfo = playersData.map(p => `${p.name}(${p.socket.id.substring(0,4)})`).join(', ');
        console.log(`[GameManager] Creating game ${gameId} for players: ${playerInfo}`);

        try {
            // Create the GameInstance, passing the necessary data (including name).
            const gameInstance = new GameInstance(gameId, this.io, playersData);

            this.activeGames.set(gameId, gameInstance);

            // Map each player's socket ID to this game ID and notify them.
            playersData.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);

                // Notify the client that the game is starting. Include player list with names/appearances.
                player.socket.emit('gameStart', {
                    gameId: gameId,
                    players: playersData.map(p => ({
                        id: p.socket.id,
                        name: p.name,
                        appearance: p.appearance
                     })) // Send all player info
                });
                console.log(`[GameManager] Notified player ${player.name} that game ${gameId} is starting.`);
            });

            gameInstance.startGameLoop();

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId}:`, error);
            // Handle game creation error (e.g., notify players, put back in pending?)
            playersData.forEach(player => {
                 // Put players back in pending, mark as not ready
                 player.isReady = false; // Ensure they aren't immediately picked again
                 this.pendingPlayers.set(player.socket.id, player);
                 player.socket.emit('gameError', { message: "Failed to create game instance. Please Ready Up again." });
            });
             // Broadcast updated lobby status after failed game creation
             this.broadcastLobbyStatus();
        }
    }

    /**
     * Removes a disconnected or leaving player from the system.
     * Handles removing them from pending lists or active games.
     * @param {string} socketId - The ID of the player's socket.
     */
    removePlayer(socketId) {
        const playerName = this.getPlayerName(socketId) || socketId.substring(0,4)+'...'; // Get name before removing
        console.log(`[GameManager] Removing player ${playerName} (${socketId})...`);

        // Remove from pending list if they were waiting.
        const wasPending = this.pendingPlayers.delete(socketId);
        if (wasPending) {
             console.log(`[GameManager] Player ${playerName} removed from pending list.`);
        }

        // Check if the player was in an active game.
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game) {
                console.log(`[GameManager] Removing player ${playerName} from active game ${gameId}.`);
                game.removePlayer(socketId); // Tell the GameInstance

                // If the game becomes empty after removal, clean it up.
                if (game.isEmpty()) {
                    console.log(`[GameManager] Game ${gameId} is now empty. Destroying game instance.`);
                    game.stopGameLoop(); // Ensure loop is stopped before deleting
                    this.activeGames.delete(gameId);
                }
            } else {
                 console.warn(`[GameManager] Player ${playerName} mapped to non-existent game ${gameId}. Cleaning up map.`);
            }
            this.playerGameMap.delete(socketId); // Remove player from game map
        } else if (!wasPending) {
             console.log(`[GameManager] Player ${playerName} (${socketId}) not found in pending or active games.`);
        }
        // Note: broadcastLobbyStatus() is called from socket-handler after removePlayer
    }

    /**
     * Calculates the current lobby status (waiting/ready counts) and broadcasts it to all clients.
     */
    broadcastLobbyStatus() {
        const totalWaiting = this.pendingPlayers.size;
        const readyCount = Array.from(this.pendingPlayers.values()).filter(p => p.isReady).length;

        const statusData = {
            waiting: totalWaiting,
            ready: readyCount
            // Add more data later? e.g., list of waiting player names?
        };

        // console.log("[GameManager] Broadcasting Lobby Status:", statusData); // Debug log
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
                game.queueAction(socketId, action);
            }
        } else {
             const playerName = this.getPlayerName(socketId) || socketId;
             console.warn(`[GameManager] Received action from player ${playerName} not currently in a game.`);
        }
    }

    // --- TODO: Methods for explicit Ready system (Phase 2 Priority 3) ---
    // setPlayerReadyStatus(socketId, isReady) { ... }
    // handlePlayerReset(socketId) { ... } // Could potentially just set isReady = false

}

module.exports = GameManager;