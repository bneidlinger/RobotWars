// server/game-manager.js
const GameInstance = require('./game-instance'); // Manages a single game match

/**
 * Manages the overall flow of players joining, waiting, and starting games.
 * Handles basic matchmaking by grouping ready players.
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
        // Value: { socket: SocketIO.Socket, code: string | null, appearance: string }
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
     * Adds a newly connected player to the waiting list.
     * @param {SocketIO.Socket} socket - The socket object for the connected player.
     */
    addPlayer(socket) {
        console.log(`[GameManager] Player ${socket.id} connected and is waiting.`);
        // Add player to the pending list with null code and default appearance initially.
        this.pendingPlayers.set(socket.id, {
            socket: socket,
            code: null,
            appearance: 'default' // Default appearance until specified by player
        });
    }

    /**
     * Handles receiving code and appearance data from a player.
     * Updates the player's status and attempts matchmaking if enough players are ready.
     * @param {string} socketId - The ID of the player submitting data.
     * @param {string} code - The robot AI code submitted by the player.
     * @param {string} appearance - The appearance identifier chosen by the player.
     */
    handlePlayerCode(socketId, code, appearance) {
        // Find the player in the pending list.
        const playerData = this.pendingPlayers.get(socketId);

        // Ignore if the player isn't found (e.g., already in a game or disconnected).
        if (!playerData) {
            console.log(`[GameManager] Received data from unknown or already in-game player: ${socketId}`);
            return;
        }

        console.log(`[GameManager] Received code and appearance ('${appearance}') from ${socketId}.`);

        // Update the player's data.
        playerData.code = code;
        // Validate appearance - ensure it's a non-empty string, fallback to 'default'.
        playerData.appearance = (typeof appearance === 'string' && appearance.trim()) ? appearance : 'default';

        // --- Basic Matchmaking Logic ---
        // Check if enough players have submitted their code.
        const readyPlayers = Array.from(this.pendingPlayers.values())
                                .filter(p => p.code !== null); // Player is ready if code is submitted

        // For this example, start a game as soon as 2 players are ready.
        const requiredPlayers = 2; // TODO: Make this configurable?
        if (readyPlayers.length >= requiredPlayers) {
            console.log(`[GameManager] ${readyPlayers.length}/${requiredPlayers} players ready. Starting game...`);

            // Select the players for the new game (take the first N ready players).
            const playersForGame = readyPlayers.slice(0, requiredPlayers);

            // Remove these players from the pending list.
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));

            // Create and start the new game instance.
            this.createGame(playersForGame); // Pass the array of player data objects
        } else {
            console.log(`[GameManager] Waiting for more players. ${readyPlayers.length}/${requiredPlayers} ready.`);
            // Optionally notify the waiting player(s)
            // playerData.socket.emit('waiting', { playersReady: readyPlayers.length, required: requiredPlayers });
        }
    }

    /**
     * Creates a new GameInstance, adds it to the active games list,
     * maps players to the game, and starts the game loop.
     * @param {Array<{socket: SocketIO.Socket, code: string, appearance: string}>} players - Array of player data objects for the new game.
     */
    createGame(players) {
        // Generate a unique ID for the game.
        const gameId = `game-${this.gameIdCounter++}`;
        const playerIds = players.map(p => p.socket.id).join(', ');
        console.log(`[GameManager] Creating game ${gameId} for players: ${playerIds}`);

        try {
            // Create the GameInstance, passing the necessary data.
            const gameInstance = new GameInstance(gameId, this.io, players); // Pass full player data array

            // Store the active game instance.
            this.activeGames.set(gameId, gameInstance);

            // Map each player's socket ID to this game ID and notify them.
            players.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);

                // Notify the client that the game is starting and include basic opponent info.
                player.socket.emit('gameStart', {
                    gameId: gameId,
                    // Send IDs and appearances of all players in the game
                    players: players.map(p => ({ id: p.socket.id, appearance: p.appearance }))
                });
                console.log(`[GameManager] Notified player ${player.socket.id} that game ${gameId} is starting.`);
            });

            // Start the simulation loop for the new game instance.
            gameInstance.startGameLoop();

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId}:`, error);
            // Handle game creation error (e.g., notify players, cleanup)
            players.forEach(player => {
                 // Put players back in pending? Or just send error?
                 this.pendingPlayers.set(player.socket.id, player); // Simplistic retry: put back
                 player.socket.emit('gameError', { message: "Failed to create game instance." });
            });
        }
    }

    /**
     * Removes a disconnected or leaving player from the system.
     * Handles removing them from pending lists or active games.
     * @param {string} socketId - The ID of the player's socket.
     */
    removePlayer(socketId) {
        console.log(`[GameManager] Removing player ${socketId}...`);

        // Remove from pending list if they were waiting.
        const wasPending = this.pendingPlayers.delete(socketId);
        if (wasPending) {
             console.log(`[GameManager] Player ${socketId} removed from pending list.`);
        }

        // Check if the player was in an active game.
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game) {
                console.log(`[GameManager] Removing player ${socketId} from active game ${gameId}.`);
                // Tell the GameInstance to handle the player removal.
                game.removePlayer(socketId);

                // If the game becomes empty after removal, clean it up.
                if (game.isEmpty()) {
                    console.log(`[GameManager] Game ${gameId} is now empty. Destroying game instance.`);
                    game.stopGameLoop(); // Ensure loop is stopped before deleting
                    this.activeGames.delete(gameId);
                }
            } else {
                 console.warn(`[GameManager] Player ${socketId} mapped to non-existent game ${gameId}. Cleaning up map.`);
            }
            // Remove the player from the game map regardless.
            this.playerGameMap.delete(socketId);
        } else if (!wasPending) {
             console.log(`[GameManager] Player ${socketId} not found in pending or active games.`);
        }
    }

    /**
     * Routes an action received from a player to the correct game instance.
     * (Currently not used with server-side interpreter, but kept for potential future use).
     * @param {string} socketId - The ID of the player sending the action.
     * @param {object} action - The action object sent by the client.
     */
    handlePlayerAction(socketId, action) {
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game && typeof game.queueAction === 'function') {
                // Delegate action handling to the specific GameInstance
                game.queueAction(socketId, action);
            }
        } else {
             console.warn(`[GameManager] Received action from player ${socketId} not currently in a game.`);
        }
    }
}

module.exports = GameManager;