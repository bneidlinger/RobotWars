// client/js/engine/game.js

/**
 * Client-side Game class for Robot Wars.
 * Manages the connection to the server, receives game state,
 * renders the game arena based on server information, and handles
 * player game lifecycle and spectator mode transitions using the Controls state machine. // <-- Updated description
 * Does NOT run the simulation locally.
 */
class Game {
    /**
     * Creates a Game instance.
     * @param {string} arenaId - The ID of the HTML canvas element used for the arena.
     */
    constructor(arenaId) {
        // Arena handles drawing the canvas, grid, robots, and visual effects (explosions)
        try {
            this.arena = new Arena(arenaId); // Arena constructor might throw if canvas/context fails
        } catch (error) {
            console.error("Failed to initialize Arena:", error);
            alert(`Critical Error: Could not initialize game graphics.\n${error.message}`);
            // Attempt to prevent further errors if arena failed
            this.arena = null; // Mark arena as unusable
        }

        // Store local representations of game state received from the server
        this.robots = []; // Data objects for robots, including appearance and name
        this.missiles = []; // Data objects for missiles (Arena will access this to draw)

        // State variables for the client game flow
        this.running = false; // Is the rendering loop active?
        this.animationFrame = null; // ID for requestAnimationFrame
        this.myPlayerId = null; // This client's unique ID
        this.lastServerState = null; // The most recent gameState received
        this.gameId = null; // ID of the current server game instance being played OR spectated
        this.gameName = null; // Name of the current game being played OR spectated
    }

    /**
     * Stores the player ID assigned by the server.
     * Called by network.js upon receiving the 'assignId' event.
     * @param {string} id - The socket ID assigned by the server.
     */
    setPlayerId(id) {
        this.myPlayerId = id;
        console.log("My Player ID assigned:", this.myPlayerId);
    }

    /**
     * Updates the local game representation based on state received from the server.
     * Called by network.js upon receiving the 'gameStateUpdate' event.
     * This includes updating robot positions, damage, appearance, name, missiles, and triggering explosions.
     * @param {object} gameState - The game state object sent by the server.
     */
    updateFromServer(gameState) {
        if (!gameState) return;

        // Only update if the game ID matches the one we are playing/spectating
        // Network.js should filter, but double-checking is safe.
        if (gameState.gameId !== this.gameId) {
             // console.warn(`Received gameState for ${gameState.gameId}, but current game is ${this.gameId}. Skipping.`);
             return;
        }

        this.lastServerState = gameState;
        // Update game name if it changed (unlikely but possible)
        this.gameName = gameState.gameName || this.gameName || gameState.gameId; // Keep existing if not provided, fallback to ID

        // --- Update Robots ---
        if (gameState.robots) {
            // Map server robot data to simple objects for rendering
            this.robots = gameState.robots.map(serverRobotData => ({
                id: serverRobotData.id,
                x: serverRobotData.x,
                y: serverRobotData.y,
                direction: serverRobotData.direction,
                damage: serverRobotData.damage,
                color: serverRobotData.color,
                isAlive: serverRobotData.isAlive,
                radius: 15, // Assuming fixed radius for client rendering logic
                appearance: serverRobotData.appearance || 'default',
                name: serverRobotData.name || 'Unknown'
            }));
            if (this.arena) {
                this.arena.robots = this.robots;
            }
        } else {
            this.robots = [];
            if (this.arena) {
                 this.arena.robots = [];
            }
        }

        // --- Update Missiles ---
        if (gameState.missiles) {
            this.missiles = gameState.missiles.map(serverMissileData => ({
                id: serverMissileData.id,
                x: serverMissileData.x,
                y: serverMissileData.y,
                radius: serverMissileData.radius
            }));
        } else {
            this.missiles = [];
        }

        // --- Trigger Client-Side Explosions ---
        if (this.arena && gameState.explosions && gameState.explosions.length > 0) {
            gameState.explosions.forEach(expData => {
                if (typeof this.arena.createExplosion === 'function') {
                    this.arena.createExplosion(expData.x, expData.y, expData.size);
                }
            });
        }

        // --- Update UI Elements (Dashboard) ---
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
             const context = { gameName: this.gameName };
             window.dashboard.updateStats(this.robots, context);
        }
    }

    /**
     * The main client-side rendering loop. Runs via requestAnimationFrame.
     * Delegates the actual drawing work to the Arena's draw() method.
     */
    clientRenderLoop() {
        if (!this.running) return;
        if (this.arena) {
            this.arena.draw(); // Arena accesses this.robots and this.missiles
        } else {
             console.error("Render loop cannot run because Arena object is missing.");
             this.stop();
             return;
        }
        this.animationFrame = requestAnimationFrame(this.clientRenderLoop.bind(this));
    }

    /**
     * Starts the client-side rendering loop.
     * Typically called when 'gameStart' or 'spectateStart' is received.
     */
    startRenderLoop() {
        if (this.running) return;
        if (!this.arena) {
             console.error("Cannot start render loop because Arena is not initialized.");
             return;
        }
        console.log("Starting client render loop...");
        this.running = true;
        this.clientRenderLoop();
    }

    /**
     * Stops the client-side rendering loop.
     * Called on disconnection, 'gameOver', 'spectateGameOver', or before starting new game/spectate.
     */
    stop() {
        if (!this.running) return;
        console.log("Stopping client render loop.");
        this.running = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /** Clears local game state (robots, missiles, etc.) and resets arena/dashboard */
    clearLocalState() {
        console.log("Clearing local game state (robots, missiles, arena, dashboard)...");
        if (this.arena) {
            this.arena.explosions = []; // Clear visual effects in arena
            this.arena.robots = []; // Clear arena's robot list
            this.arena.clear(); // Draw background/grid immediately
        }
        this.missiles = []; // Clear missile list in game state
        this.robots = []; // Clear robot list
        this.lastServerState = null; // Clear last known state
        this.gameId = null; // Clear game ID/Name
        this.gameName = null;
        // Clear dashboard (pass empty context)
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
            window.dashboard.updateStats([], {});
        } else {
            console.warn("Dashboard object or updateStats method not found during clearLocalState.");
        }
    }


    // --- Game Lifecycle & Spectator Handlers (Called by network.js) ---

    /**
     * Handles the 'gameStart' event from the server. Prepares the client for playing the match.
     * @param {object} data - Data associated with the game start { gameId, gameName, players }.
     */
    handleGameStart(data) {
        console.log("Game Start signal received:", data);
        this.stop();
        this.clearLocalState();

        this.gameId = data.gameId;
        this.gameName = data.gameName || data.gameId; // Store game name

        if (data.players) {
            console.log("Players in this game:", data.players.map(p => `${p.name} (${p.appearance})`).join(', '));
        }

        this.startRenderLoop();

        // --- Update Controls state to 'playing' ---
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
             controls.setState('playing'); // Use the new state manager
        } else {
             console.warn("Controls object or setState method not found, UI may not lock correctly for game start.");
        }

        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus(`Playing Game: ${this.gameName}`);
        }
    }

    /**
     * Handles the 'gameOver' event from the server (for players). Cleans up the client state and UI.
     * @param {object} data - Data associated with the game end { gameId, winnerId, winnerName, reason }.
     */
    handleGameOver(data) {
        console.log("Game Over signal received (as player):", data);
        this.stop(); // Stop the rendering loop

        // Display winner message
        let winnerDisplayName = 'None';
        if (data.winnerName) winnerDisplayName = data.winnerName;
        else if (data.winnerId) winnerDisplayName = `ID: ${data.winnerId.substring(0, 6)}...`;

        const endedGameName = this.gameName || data.gameId; // Use stored name if available
        const message = `Game '${endedGameName}' Over! ${data.reason || 'Match ended.'} Winner: ${winnerDisplayName}`;
        alert(message); // Display name (or fallback) in alert

        // --- Update Controls state back to 'lobby' ---
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
             controls.setState('lobby'); // Use the new state manager
        } else {
            console.warn("Controls object or setState method not found, UI may not reset correctly after game over.");
        }

        // Update lobby status display
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus('Game Over. Ready Up for another match!');
        }

        // Clear the display after a short delay
         setTimeout(() => {
              this.clearLocalState();
         }, 2000); // 2-second delay
    }


    // --- Spectator Mode Handlers ---

    /**
     * Handles the 'spectateStart' event from the server. Prepares the client for spectating.
     * @param {object} spectateData - Data associated with spectating { gameId, gameName }.
     */
    handleSpectateStart(spectateData) {
        console.log("Starting spectate mode for game:", spectateData);
        this.stop(); // Ensure any previous rendering is stopped
        this.clearLocalState(); // Clear state from any previous session

        this.gameId = spectateData.gameId; // Store the ID of the game being spectated
        this.gameName = spectateData.gameName || spectateData.gameId; // Store the name

        // --- Update Controls state to 'spectating' ---
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
            controls.setState('spectating'); // Use the new state manager
        } else {
            console.warn("Controls object or setState method not found, UI may not lock correctly for spectating.");
        }

        // Update UI (lobby status) to show spectating status
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus(`Spectating Game: ${this.gameName}`);
        }

        // Start rendering the spectated game
        this.startRenderLoop();
    }

    /**
     * Handles the 'spectateGameOver' event from the server. Transitions client back to lobby state.
     * @param {object} gameOverData - Data associated with the game end { gameId, winnerId, winnerName, reason }.
     */
    handleSpectateEnd(gameOverData) {
        console.log("Spectate mode ended:", gameOverData);
        this.stop(); // Stop the rendering loop

         // --- Update Controls state back to 'lobby' ---
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
            controls.setState('lobby'); // Use the new state manager
        } else {
             console.warn("Controls object or setState method not found, UI may not reset correctly after spectating.");
        }

        // Update UI (lobby status) to show returned to lobby
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus('Returned to Lobby. Enter name & code, then Ready Up!');
        }

        // Display game over message to the spectator
        let winnerDisplayName = gameOverData.winnerName || (gameOverData.winnerId ? `ID: ${gameOverData.winnerId.substring(0, 6)}...` : 'None');
        const endedGameName = this.gameName || gameOverData.gameId; // Use stored name
        const message = `Spectated game '${endedGameName}' finished!\nWinner: ${winnerDisplayName}. (${gameOverData.reason || 'Match ended.'})`;
        alert(message);

        // Clear the display and state after a shorter delay
        setTimeout(() => {
             this.clearLocalState();
        }, 1500); // 1.5-second delay
    }

} // End Game Class