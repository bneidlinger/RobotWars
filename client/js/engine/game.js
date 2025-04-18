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
     * This includes updating robot positions, damage, appearance, name, missiles, and triggering explosions.
     * @param {object} gameState - The game state object sent by the server.
     */
    updateFromServer(gameState) {
        if (!gameState) return;

        this.lastServerState = gameState;
        this.gameId = gameState.gameId;

        // --- Update Robots ---
        if (gameState.robots) {
            // Map server robot data to simple objects for rendering, including appearance and name
            this.robots = gameState.robots.map(serverRobotData => ({
                id: serverRobotData.id,
                x: serverRobotData.x,
                y: serverRobotData.y,
                direction: serverRobotData.direction,
                damage: serverRobotData.damage,
                color: serverRobotData.color,
                isAlive: serverRobotData.isAlive,
                radius: 15, // Assuming fixed radius for client rendering logic
                appearance: serverRobotData.appearance || 'default', // Store appearance
                // --- Corrected: Copy the name property from server data ---
                name: serverRobotData.name || 'Unknown' // Copy name, fallback if missing
                // --- End Correction ---
            }));
            // Update the Arena's list so it can draw them using the correct appearance and name
            // Check if arena exists before trying to update it
            if (this.arena) {
                this.arena.robots = this.robots;
            }
        } else {
            // If no robot data, clear local list and arena's list
            this.robots = [];
            if (this.arena) {
                 this.arena.robots = [];
            }
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
        if (this.arena && gameState.explosions && gameState.explosions.length > 0) {
            gameState.explosions.forEach(expData => {
                // Tell the Arena instance to create the visual effect
                if (typeof this.arena.createExplosion === 'function') {
                    // console.log(`Client creating visual explosion for event ${expData.id}`); // Debug log
                    this.arena.createExplosion(expData.x, expData.y, expData.size);
                }
            });
        }

        // --- Update UI Elements (Dashboard) ---
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
            // Pass the current robot data (which includes name, damage, status) to the dashboard
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

        // Ensure arena exists before attempting to draw
        if (this.arena) {
            // 1. Ask the Arena to draw everything based on the current state
            this.arena.draw();
        } else {
             // If arena doesn't exist, stop the loop to prevent errors
             console.error("Render loop cannot run because Arena object is missing.");
             this.stop();
             return;
        }

        // 2. Request the next frame to continue the animation loop
        this.animationFrame = requestAnimationFrame(this.clientRenderLoop.bind(this));
    }

    /**
     * Starts the client-side rendering loop.
     * Typically called when the 'gameStart' event is received from the server.
     */
    startRenderLoop() {
        if (this.running) return; // Prevent starting multiple loops
        // Prevent starting if arena failed to initialize
        if (!this.arena) {
             console.error("Cannot start render loop because Arena is not initialized.");
             return;
        }
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
     * @param {object} data - Data associated with the game start (e.g., game ID, player list with names/appearances).
     */
    handleGameStart(data) {
        console.log("Game Start signal received:", data);
        this.gameId = data.gameId;

        // Reset local state from any previous game only if arena exists
        if (this.arena) {
            this.arena.explosions = []; // Clear visual effects in arena
        }
        this.missiles = []; // Clear missile list in game state
        this.robots = []; // Clear robot list
        if (this.arena) {
            this.arena.robots = []; // Clear arena's robot list
        }
        this.lastServerState = null; // Clear last known state

        // Log players in the game
        if (data.players) {
            console.log("Players in this game:", data.players.map(p => `${p.name} (${p.appearance})`).join(', '));
        }

        // Start rendering the game now that it's begun
        this.startRenderLoop();

        // Update UI elements to reflect the "in-game" state
        // Note: controls.js setReadyState(true) might have already done this,
        // but this ensures consistency if game starts unexpectedly.
        const readyButton = document.getElementById('btn-ready');
        const appearanceSelect = document.getElementById('robot-appearance-select');
        const playerNameInput = document.getElementById('playerName');
        if (readyButton) {
            readyButton.textContent = "Game in Progress...";
            readyButton.disabled = true; // Disable ready/unready during game
             // Optional: change color to indicate locked state
             // readyButton.style.backgroundColor = '#555';
        }
        if (appearanceSelect) {
            appearanceSelect.disabled = true;
        }
         if (playerNameInput) {
             playerNameInput.disabled = true;
         }
        // Consider making editor read-only during game
        // if (typeof editor !== 'undefined') editor.setOption("readOnly", true);
    }

    /**
     * Handles the 'gameOver' event from the server. Cleans up the client state and UI.
     * @param {object} data - Data associated with the game end (e.g., reason, winnerId, winnerName).
     */
    handleGameOver(data) {
        console.log("Game Over signal received:", data);
        this.stop(); // Stop the rendering loop

        // --- Updated Winner Display ---
        // Use winnerName if provided by the server, otherwise fallback to ID or 'None'.
        let winnerDisplayName = 'None'; // Default
        if (data.winnerName) {
            winnerDisplayName = data.winnerName; // Use the name if available
        } else if (data.winnerId) {
            // Fallback to partial ID if name is missing but ID is present
            winnerDisplayName = `ID: ${data.winnerId.substring(0, 6)}...`;
        }
        const message = `Game Over! ${data.reason || 'Match ended.'} Winner: ${winnerDisplayName}`;
        alert(message); // Display name (or fallback) in alert
        // --- End Updated Winner Display ---

        // --- Reset UI Elements using Controls helper ---
        // Ensure the global 'controls' object exists and reset its state
        if (typeof controls !== 'undefined' && typeof controls.setReadyState === 'function') {
            controls.setReadyState(false); // Reset button text/state and enable inputs
        } else {
            // Fallback if 'controls' object isn't available (shouldn't happen)
            console.warn("Controls object not found, attempting manual UI reset for game over.");
            const readyButton = document.getElementById('btn-ready');
            const appearanceSelect = document.getElementById('robot-appearance-select');
            const playerNameInput = document.getElementById('playerName');
            const sampleCodeSelect = document.getElementById('sample-code');
            const editorIsAvailable = typeof editor !== 'undefined';

            if (readyButton) { readyButton.textContent = "Ready Up"; readyButton.disabled = false; readyButton.style.backgroundColor = '#4CAF50'; }
            if (appearanceSelect) { appearanceSelect.disabled = false; }
            if (playerNameInput) { playerNameInput.disabled = false; }
            if (sampleCodeSelect) { sampleCodeSelect.disabled = false; }
            if (editorIsAvailable) editor.setOption("readOnly", false);
        }
        // --- End Reset UI Elements ---

        // Update lobby status (Network listener also does this, potentially redundant but safe)
        if (typeof updateLobbyStatus === 'function') {
             updateLobbyStatus('Game Over. Ready Up for another match!');
        }

        // Optional: Clear the display after a short delay if desired
        // setTimeout(() => {
        //      if(this.arena) this.arena.clear(); // Clear canvas if arena exists
        //      if(window.dashboard) window.dashboard.updateStats([]); // Clear dashboard
        // }, 2000);
    }

} // End Game Class