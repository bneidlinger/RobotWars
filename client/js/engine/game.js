// client/js/engine/game.js

/**
 * Client-side Game class for Robot Wars.
 * Manages the connection to the server, receives game state,
 * and renders the game arena based on server information.
 * Does NOT run the simulation locally.
 */
class Game {
    /**
     * Creates a Game instance.
     * @param {string} arenaId - The ID of the HTML canvas element used for the arena.
     */
    constructor(arenaId) {
        // Arena handles drawing the canvas, grid, robots, and visual effects (explosions)
        this.arena = new Arena(arenaId);

        // Store local representations of game state received from the server
        this.robots = []; // Data objects for robots, including appearance
        this.missiles = []; // Data objects for missiles (Arena will access this to draw)

        // State variables for the client game flow
        this.running = false; // Is the rendering loop active?
        this.animationFrame = null; // ID for requestAnimationFrame
        this.myPlayerId = null; // This client's unique ID
        this.lastServerState = null; // The most recent gameState received
        this.gameId = null; // ID of the current server game instance
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
     * This includes updating robot positions, damage, appearance, missiles, and triggering explosions.
     * @param {object} gameState - The game state object sent by the server.
     */
    updateFromServer(gameState) {
        if (!gameState) return;

        this.lastServerState = gameState;
        this.gameId = gameState.gameId;

        // --- Update Robots ---
        if (gameState.robots) {
            // Map server robot data to simple objects for rendering, including appearance
            this.robots = gameState.robots.map(serverRobotData => ({
                id: serverRobotData.id,
                x: serverRobotData.x,
                y: serverRobotData.y,
                direction: serverRobotData.direction,
                damage: serverRobotData.damage,
                color: serverRobotData.color,
                isAlive: serverRobotData.isAlive,
                radius: 15, // Assuming fixed radius for client rendering logic
                appearance: serverRobotData.appearance || 'default' // Store appearance
            }));
            // Update the Arena's list so it can draw them using the correct appearance
            this.arena.robots = this.robots;
        } else {
            // If no robot data, clear local list and arena's list
            this.robots = [];
            this.arena.robots = [];
        }

        // --- Update Missiles ---
        // Store the missile data locally; Arena's draw() method will render them
        if (gameState.missiles) {
            this.missiles = gameState.missiles.map(serverMissileData => ({
                id: serverMissileData.id,
                x: serverMissileData.x,
                y: serverMissileData.y,
                radius: serverMissileData.radius,
                // Note: Color is applied by Arena.drawMissiles
            }));
        } else {
            // If no missile data, clear local list
            this.missiles = [];
        }

        // --- Trigger Client-Side Explosions ---
        // Check if the server sent any explosion events this tick
        if (gameState.explosions && gameState.explosions.length > 0) {
            gameState.explosions.forEach(expData => {
                // Tell the Arena instance to create the visual effect
                if (this.arena && typeof this.arena.createExplosion === 'function') {
                    // console.log(`Client creating visual explosion for event ${expData.id}`); // Debug log
                    this.arena.createExplosion(expData.x, expData.y, expData.size);
                }
            });
        }

        // --- Update UI Elements (Dashboard) ---
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
            // Pass the current robot data (which includes damage, status) to the dashboard
            window.dashboard.updateStats(this.robots);
        }
    }

    /**
     * The main client-side rendering loop. Runs via requestAnimationFrame.
     * Delegates the actual drawing work to the Arena's draw() method.
     */
    clientRenderLoop() {
        // Stop the loop if the game is no longer marked as running
        if (!this.running) return;

        // 1. Ask the Arena to draw everything based on the current state
        //    (Arena accesses game.robots and game.missiles internally if needed by its draw method)
        this.arena.draw();

        // 2. Request the next frame to continue the animation loop
        this.animationFrame = requestAnimationFrame(this.clientRenderLoop.bind(this));
    }

    /**
     * Starts the client-side rendering loop.
     * Typically called when the 'gameStart' event is received from the server.
     */
    startRenderLoop() {
        if (this.running) return; // Prevent starting multiple loops
        console.log("Starting client render loop...");
        this.running = true;
        this.clientRenderLoop(); // Initiate the animation loop
    }

    /**
     * Stops the client-side rendering loop.
     * Typically called on disconnection or when 'gameOver' is received from the server.
     */
    stop() {
        if (!this.running) return;
        console.log("Stopping client render loop.");
        this.running = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame); // Stop requesting new frames
            this.animationFrame = null;
        }
    }

    // --- Game Lifecycle Handlers (Called by network.js based on server events) ---

    /**
     * Handles the 'gameStart' event from the server. Prepares the client for the match.
     * @param {object} data - Data associated with the game start (e.g., game ID, player list with appearances).
     */
    handleGameStart(data) {
        console.log("Game Start signal received:", data);
        this.gameId = data.gameId;
        // Reset local state from any previous game
        if (this.arena) {
            this.arena.explosions = []; // Clear visual effects in arena
        }
        this.missiles = []; // Clear missile list in game state
        this.robots = []; // Clear robot list
        this.arena.robots = []; // Clear arena's robot list
        this.lastServerState = null; // Clear last known state

        // Start rendering the game now that it's begun
        this.startRenderLoop();

        // Update UI elements to reflect the "in-game" state
        const runButton = document.getElementById('btn-run');
        const appearanceSelect = document.getElementById('robot-appearance-select');
        if (runButton) {
            runButton.textContent = "Game in Progress...";
            runButton.disabled = true;
        }
        if (appearanceSelect) {
            appearanceSelect.disabled = true; // Disable changing appearance during game
        }
        // Consider making editor read-only during game
        // if (typeof editor !== 'undefined') editor.setOption("readOnly", true);
    }

    /**
     * Handles the 'gameOver' event from the server. Cleans up the client state and UI.
     * @param {object} data - Data associated with the game end (e.g., reason, winner ID).
     */
    handleGameOver(data) {
        console.log("Game Over signal received:", data);
        this.stop(); // Stop the rendering loop

        // Display game over message to the user
        const winnerName = data.winner ? data.winner.substring(0, 6) + '...' : 'None'; // Show partial ID or None
        const message = `Game Over! ${data.reason || 'Match ended.'} Winner: ${winnerName}`;
        alert(message);

        // Reset UI elements to allow starting a new game
        const runButton = document.getElementById('btn-run');
        const appearanceSelect = document.getElementById('robot-appearance-select');
        if (runButton) {
            runButton.textContent = "Run Simulation";
            runButton.disabled = false;
        }
         if (appearanceSelect) {
            appearanceSelect.disabled = false; // Re-enable appearance selection
        }
        // if (typeof editor !== 'undefined') editor.setOption("readOnly", false); // Allow editing again

        // Optional: Clear the display after a short delay if desired
        // setTimeout(() => { ... }, 2000);
    }
} // End Game Class