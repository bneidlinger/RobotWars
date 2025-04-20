// client/js/engine/game.js

/**
 * Client-side Game class for Robot Wars.
 * Manages the connection to the server, receives game state,
 * renders the game arena based on server information, handles robot destruction visuals, // <-- Updated description
 * and handles player game lifecycle and spectator mode transitions using the Controls state machine.
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
            // START CHANGE: Arena now directly referenced as renderer for clarity
            this.renderer = new Arena(arenaId); // Arena constructor might throw
            // END CHANGE
        } catch (error) {
            console.error("Failed to initialize Arena/Renderer:", error);
            alert(`Critical Error: Could not initialize game graphics.\n${error.message}`);
            this.renderer = null; // Mark renderer as unusable
        }

        // Store local representations of game state received from the server
        // START CHANGE: this.robots now stores simple data objects derived from server state
        this.robots = {}; // Key: robotId, Value: { id, x, y, ..., isDestroyed: boolean, visible: boolean }
        // END CHANGE
        this.missiles = []; // Data objects for missiles (Renderer will access this to draw)

        // State variables for the client game flow
        this.running = false; // Is the rendering loop active?
        this.animationFrame = null; // ID for requestAnimationFrame
        this.myPlayerId = null; // This client's unique ID
        this.lastServerState = null; // The most recent gameState received
        this.gameId = null; // ID of the current server game instance being played OR spectated
        this.gameName = null; // Name of the current game being played OR spectated

        // START CHANGE: Store active explosion effects
        this.activeExplosions = [];
        // END CHANGE
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
        if (gameState.gameId !== this.gameId) {
             return;
        }

        this.lastServerState = gameState;
        this.gameName = gameState.gameName || this.gameName || gameState.gameId;

        // --- Update Robots ---
        const currentRobotIds = new Set(); // Track IDs received in this update
        if (gameState.robots) {
            gameState.robots.forEach(serverRobotData => {
                const robotId = serverRobotData.id;
                currentRobotIds.add(robotId);

                // Get existing client-side data or create new
                let clientRobotData = this.robots[robotId];
                if (!clientRobotData) {
                    clientRobotData = { id: robotId }; // Initialize if new
                    this.robots[robotId] = clientRobotData;
                }

                // Update properties from server
                clientRobotData.x = serverRobotData.x;
                clientRobotData.y = serverRobotData.y;
                clientRobotData.direction = serverRobotData.direction;
                clientRobotData.damage = serverRobotData.damage;
                clientRobotData.color = serverRobotData.color;
                clientRobotData.appearance = serverRobotData.appearance || 'default';
                clientRobotData.name = serverRobotData.name || 'Unknown';
                clientRobotData.radius = 15; // Assume fixed client-side radius

                // START CHANGE: Preserve destruction state from handleRobotDestroyed
                // Only update visibility based on server 'isAlive' if not already marked destroyed locally
                if (clientRobotData.isDestroyed === undefined) {
                    clientRobotData.isDestroyed = !serverRobotData.isAlive; // Initialize if needed
                }
                // Only set visible based on server if not locally marked as destroyed/hidden
                if (!clientRobotData.isDestroyed) {
                    clientRobotData.visible = serverRobotData.isAlive;
                } else {
                    // Ensure it stays hidden if marked destroyed locally
                    clientRobotData.visible = false;
                }
                // END CHANGE
            });
        }

        // --- Remove robots that are no longer in the server state ---
        // START CHANGE: Update robot removal logic for object storage
        for (const robotId in this.robots) {
            if (!currentRobotIds.has(robotId)) {
                // If a robot is gone from server state AND not marked destroyed (e.g. clean disconnect), hide it.
                if (!this.robots[robotId].isDestroyed) {
                    this.robots[robotId].visible = false;
                }
                // Optional: delete this.robots[robotId]; ? Let's keep it for now in case of late destruction event.
            }
        }
        // Pass the values (robot data objects) to the renderer
        if (this.renderer) {
             this.renderer.robots = Object.values(this.robots);
        }
        // END CHANGE


        // --- Update Missiles ---
        if (gameState.missiles) {
            this.missiles = gameState.missiles.map(serverMissileData => ({
                id: serverMissileData.id,
                x: serverMissileData.x,
                y: serverMissileData.y,
                radius: serverMissileData.radius
                // Add ownerId if needed for rendering?
            }));
        } else {
            this.missiles = [];
        }

        // --- Trigger Client-Side Explosions (from missile hits, maybe?) ---
        // Note: The primary explosion trigger is now handleRobotDestroyed
        // This section might be redundant or for other explosion types if added later.
        if (this.renderer && gameState.explosions && gameState.explosions.length > 0) {
            gameState.explosions.forEach(expData => {
                 // Avoid duplicating explosions triggered by handleRobotDestroyed
                 // Simple check: don't add if an explosion is already very close? Risky.
                 // Let's assume server 'explosions' are *different* from robot death explosions for now.
                if (typeof this.renderer.createExplosion === 'function') { // Check Arena method exists
                    // This was the old client-side effect creator. We'll replace it with the new one.
                    // this.renderer.createExplosion(expData.x, expData.y, expData.size);
                    // Let's use the new method to keep things consistent
                    // this.addExplosionEffect(expData.x, expData.y, expData.size);
                    // Actually, let server handle ALL explosion triggers via dedicated events if needed.
                    // The only explosion we trigger now is from handleRobotDestroyed.
                    // Keep this block commented out unless other server-driven explosions are added.
                }
            });
        }

        // --- Update UI Elements (Dashboard) ---
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
             const context = { gameName: this.gameName };
             // Pass the array of robot data objects
             window.dashboard.updateStats(Object.values(this.robots), context);
        }
    }

    // START CHANGE: Add handler for robot destruction
    /**
     * Handles the 'robotDestroyed' event from the server.
     * Marks the robot locally, triggers explosion and scorch mark effects.
     * @param {object} data - Data from server: { robotId, x, y, cause }
     */
    handleRobotDestroyed(data) {
        console.log(`[Game] Received robotDestroyed: ID=${data.robotId}, Pos=(${data.x}, ${data.y}), Cause=${data.cause}`);

        // Find the client-side robot data representation
        const robotData = this.robots[data.robotId];

        if (robotData) {
            robotData.isDestroyed = true; // Mark as destroyed
            robotData.visible = false;    // Hide the robot sprite immediately
            console.log(`[Game] Marked robot ${data.robotId} as destroyed locally.`);
        } else {
            console.warn(`[Game] Received robotDestroyed for unknown ID: ${data.robotId}`);
            // Still create explosion at location even if robot wasn't tracked locally? Yes.
        }

        // Add an explosion effect to be rendered
        this.addExplosionEffect(data.x, data.y, data.cause === 'selfDestruct' ? 5 : 3); // Bigger boom for self-destruct

        // Add a scorch mark (will be drawn by renderer's background logic)
        if (this.renderer && typeof this.renderer.addScorchMark === 'function') {
            this.renderer.addScorchMark(data.x, data.y, 40); // Radius of scorch mark
        }

        // TODO: Add sound effect
        // Example: this.audioManager.playSound('explosion');
    }

    /** Helper to add explosion data to the active list */
    addExplosionEffect(x, y, sizeMultiplier = 1) {
        this.activeExplosions.push({
            id: Date.now() + Math.random(), // Unique enough ID for client-side effect
            x: x,
            y: y,
            startTime: Date.now(),
            duration: 800, // ms - How long the explosion animation lasts
            maxRadius: 40 + (sizeMultiplier - 1) * 20, // Base radius 40, increases with sizeMultiplier
            colorSequence: ['#FFFF99', '#FFA500', '#FF4500', '#8B0000', '#666666'], // Yellow -> Orange -> Red -> DarkRed -> Grey
        });
         console.log(`[Game] Added explosion effect at (${x.toFixed(0)}, ${y.toFixed(0)}) size ${sizeMultiplier}`);
    }
    // END CHANGE


    /**
     * The main client-side rendering loop. Runs via requestAnimationFrame.
     * Delegates drawing to the Renderer (Arena) and updates effects.
     */
    clientRenderLoop() {
        if (!this.running) return;
        if (!this.renderer) {
             console.error("Render loop cannot run because Renderer object is missing.");
             this.stop();
             return;
        }

        // START CHANGE: Call new draw method in renderer
        // Renderer now handles background, grid, robots, missiles, AND effects
        this.renderer.draw(this.missiles, this.activeExplosions); // Pass missiles and active explosions
        // END CHANGE

        this.animationFrame = requestAnimationFrame(this.clientRenderLoop.bind(this));
    }

    /**
     * Starts the client-side rendering loop.
     * Typically called when 'gameStart' or 'spectateStart' is received.
     */
    startRenderLoop() {
        if (this.running) return;
        if (!this.renderer) {
             console.error("Cannot start render loop because Renderer is not initialized.");
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

    /** Clears local game state (robots, missiles, effects) and resets renderer/dashboard */
    clearLocalState() {
        console.log("Clearing local game state (robots, missiles, effects, renderer, dashboard)...");

        // START CHANGE: Clear explosions and reset robot data object
        this.activeExplosions = [];
        this.robots = {}; // Reset robot data store
        // END CHANGE

        if (this.renderer) {
            this.renderer.robots = []; // Clear renderer's robot list
            // Scorch marks persist until next redrawArenaBackground
            this.renderer.clear(); // Draw background/grid immediately
        }
        this.missiles = []; // Clear missile list in game state
        this.lastServerState = null; // Clear last known state
        this.gameId = null; // Clear game ID/Name
        this.gameName = null;

        // Clear dashboard
        if (window.dashboard && typeof window.dashboard.updateStats === 'function') {
            window.dashboard.updateStats([], {});
        } else {
            console.warn("Dashboard object or updateStats method not found during clearLocalState.");
        }
    }


    // --- Game Lifecycle & Spectator Handlers (Called by network.js) ---

    /**
     * Handles the 'gameStart' event from the server. Prepares the client for playing the match.
     * @param {object} data - Data associated with the game start { gameId, gameName, players, isTestGame }.
     */
    handleGameStart(data) {
        console.log("Game Start signal received:", data);
        this.stop();
        this.clearLocalState(); // Clear previous state, including explosions

        this.gameId = data.gameId;
        this.gameName = data.gameName || data.gameId; // Store game name

        // Initialize robots map from player data (they start visible and not destroyed)
        if (data.players) {
            console.log("Players in this game:", data.players.map(p => `${p.name} (${p.appearance})`).join(', '));
             data.players.forEach(p => {
                 this.robots[p.id] = {
                     id: p.id,
                     x: 0, y: 0, // Server will send position immediately
                     direction: 0,
                     damage: 0,
                     color: '#cccccc', // Default color, server state overrides
                     isAlive: true,
                     appearance: p.appearance || 'default',
                     name: p.name || 'Unknown',
                     radius: 15,
                     isDestroyed: false, // Start not destroyed
                     visible: true // Start visible
                 };
             });
             if (this.renderer) this.renderer.robots = Object.values(this.robots); // Update renderer list
        }
         // Redraw arena background to clear old scorch marks
         if (this.renderer && typeof this.renderer.redrawArenaBackground === 'function') {
             this.renderer.redrawArenaBackground();
         }


        this.startRenderLoop();

        // Update Controls state to 'playing'
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
             controls.setState('playing');
        } else {
             console.warn("Controls object or setState method not found for game start.");
        }

        if (typeof window.updateLobbyStatus === 'function') {
             const prefix = data.isTestGame ? 'Testing Code:' : 'Playing Game:';
             window.updateLobbyStatus(`${prefix} ${this.gameName}`);
        }
    }

    /**
     * Handles the 'gameOver' event from the server (for players).
     * This is called *after* the server-side destruction delay.
     * Cleans up the client state and UI.
     * @param {object} data - Data associated with the game end { gameId, winnerId, winnerName, reason, wasTestGame }.
     */
    handleGameOver(data) {
        console.log("Game Over signal received (as player):", data);
        this.stop(); // Stop the rendering loop now

        // Display winner message
        let winnerDisplayName = 'None';
        if (data.winnerName) winnerDisplayName = data.winnerName;
        else if (data.winnerId) winnerDisplayName = `ID: ${data.winnerId.substring(0, 6)}...`;

        const endedGameName = this.gameName || data.gameId;
        const message = `Game '${endedGameName}' Over! ${data.reason || 'Match ended.'} Winner: ${winnerDisplayName}`;
        alert(message); // Show alert *after* explosion animation has likely finished

        // Update Controls state back to 'lobby'
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
             controls.setState('lobby');
        } else {
            console.warn("Controls object or setState method not found for game over.");
        }

        // Update lobby status display
        const prompt = data.wasTestGame ? 'Test Complete. Ready Up or Test Again!' : 'Game Over. Ready Up for another match!';
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus(prompt);
        }

        // Clear the display state (removes remaining elements, prepares for next game)
        // No delay needed here as the visual delay happened server-side.
        this.clearLocalState();
    }


    // --- Spectator Mode Handlers ---

    /**
     * Handles the 'spectateStart' event from the server. Prepares the client for spectating.
     * @param {object} spectateData - Data associated with spectating { gameId, gameName }.
     */
    handleSpectateStart(spectateData) {
        console.log("Starting spectate mode for game:", spectateData);
        this.stop();
        this.clearLocalState();

        this.gameId = spectateData.gameId;
        this.gameName = spectateData.gameName || spectateData.gameId;

         // Redraw arena background to clear old scorch marks
         if (this.renderer && typeof this.renderer.redrawArenaBackground === 'function') {
             this.renderer.redrawArenaBackground();
         }

        // Update Controls state to 'spectating'
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
            controls.setState('spectating');
        } else {
            console.warn("Controls object or setState method not found for spectating.");
        }

        // Update UI (lobby status) to show spectating status
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus(`Spectating Game: ${this.gameName}`);
        }

        // Start rendering the spectated game
        this.startRenderLoop();
    }

    /**
     * Handles the 'spectateGameOver' event from the server.
     * Called *after* server-side delay. Transitions client back to lobby state.
     * @param {object} gameOverData - Data associated with the game end { gameId, winnerId, winnerName, reason }.
     */
    handleSpectateEnd(gameOverData) {
        console.log("Spectate mode ended:", gameOverData);
        this.stop(); // Stop the rendering loop

        // Update Controls state back to 'lobby'
        if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
            controls.setState('lobby');
        } else {
             console.warn("Controls object or setState method not found after spectating.");
        }

        // Update UI (lobby status) to show returned to lobby
        if (typeof window.updateLobbyStatus === 'function') {
             window.updateLobbyStatus('Returned to Lobby. Enter name & code, then Ready Up!');
        }

        // Display game over message to the spectator
        let winnerDisplayName = gameOverData.winnerName || (gameOverData.winnerId ? `ID: ${gameOverData.winnerId.substring(0, 6)}...` : 'None');
        const endedGameName = this.gameName || gameOverData.gameId;
        const message = `Spectated game '${endedGameName}' finished!\nWinner: ${winnerDisplayName}. (${gameOverData.reason || 'Match ended.'})`;
        alert(message);

        // Clear the display state
        this.clearLocalState();
    }

} // End Game Class