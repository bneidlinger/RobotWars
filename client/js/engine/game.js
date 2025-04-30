// client/js/engine/game.js

const MUZZLE_FLASH_DURATION_MS = 150; // How long flashes last (in milliseconds)

class Game {
    /**
     * Manages the client-side game state, rendering loop, and interactions.
     * @param {string} canvasId - The ID of the HTML canvas element for the arena.
     */
    constructor(canvasId) {
        // Renderer for the arena, robots, effects
        this.renderer = new Arena(canvasId); // Use Arena class for rendering

        // Interpreter for running local robot code (currently not used for gameplay logic)
        this.interpreter = new RobotInterpreter();

        // Collision system (currently not used client-side for primary logic)
        this.collisionSystem = new CollisionSystem(this);

        // Game State Data (populated by server updates)
        this.robots = [];           // Array of robot data objects {id, x, y, direction, damage, isAlive, name, visuals}
        this.missiles = [];         // Array of missile data objects {id, x, y, radius, ownerId, direction}
        this.activeExplosions = []; // Array for explosion effects {x, y, maxRadius, startTime, duration, colorSequence}
        this.activeFlashes = [];    // Array for muzzle flash effects {id, x, y, direction, type, startTime, duration}

        // Game Context
        this.gameId = null;         // ID of the current game
        this.gameName = null;       // Display name of the current game
        this.playerId = null;       // This client's robot ID in the current game
        this.isRunning = false;     // Is the game loop active?
        this.lastGameStateTime = 0; // Timestamp of the last received state update
        this.isSpectating = false;  // Is the client spectating?
        this.spectatingGameId = null; // ID of the game being spectated

        // Helper map for quick lookup of robot data (especially visuals) by ID
        this.robotDataMap = new Map();

        console.log("Client Game engine initialized.");
    }

    /** Sets the client's player ID for the current game */
    setPlayerId(id) {
        this.playerId = id;
        console.log(`[Game] Player ID set to: ${id}`);
    }

    /** Handles starting spectating a game */
    handleSpectateStart(data) {
        console.log(`[Game] Starting spectate mode for game: ${data.gameName} (ID: ${data.gameId})`);
        this.gameId = null; // Not playing in this game
        this.playerId = null; // Not a player in this game
        this.spectatingGameId = data.gameId;
        this.spectatingGameName = data.gameName || data.gameId;
        this.isSpectating = true;
        this.isRunning = false; // Not running own game logic
        this.robots = []; // Clear local state
        this.missiles = [];
        this.activeExplosions = [];
        this.activeFlashes = [];
        this.robotDataMap.clear();

        if (window.controls) window.controls.setState('spectating');
        if (window.dashboard?.updateStats) window.dashboard.updateStats([], { gameName: this.spectatingGameName });

        requestAnimationFrame(this.gameLoop.bind(this)); // Start rendering loop for spectating
    }

    /** Handles stopping spectating a game */
    handleSpectateEnd(data) {
        console.log(`[Game] Ending spectate mode for game: ${data.gameId}`);
        if (this.spectatingGameId === data.gameId) {
            this.isSpectating = false;
            this.spectatingGameId = null;
            this.spectatingGameName = null;
            this.activeFlashes = []; // Clear flashes
            // Transition back to lobby state
            if (window.controls) window.controls.setState('lobby');
            if (window.dashboard?.updateStats) window.dashboard.updateStats([], {}); // Clear stats
        }
    }

    /** Placeholder for handling robot destruction event (e.g., special effect) */
    handleRobotDestroyed(data) {
        console.log(`[Game] Robot ${data.robotId} destroyed at (${data.x.toFixed(0)}, ${data.y.toFixed(0)}) due to ${data.cause}.`);
        // Could trigger a larger, longer-lasting explosion effect here
        this.createExplosion(data.x, data.y, 5); // Trigger a large explosion on destruction
    }

    /** Initializes the game state when a match starts */
    handleGameStart(data) {
        console.log(`[Game] Starting game: ${data.gameName} (ID: ${data.gameId}), Test: ${data.isTestGame}`);
        this.gameId = data.gameId;
        this.gameName = data.gameName;
        this.isRunning = true;
        this.isSpectating = false; // Ensure not spectating
        this.robots = []; // Clear previous game data
        this.missiles = [];
        this.activeExplosions = [];
        this.activeFlashes = []; // Clear flashes
        this.robotDataMap.clear(); // Clear map

        // Initial population of robotDataMap for visual lookup
        // The 'players' array in gameStart contains initial info {id, name, visuals}
        if (data.players && Array.isArray(data.players)) {
            data.players.forEach(p => {
                if (p.id && p.visuals) { // Make sure ID and visuals exist
                    // Store the initial data; subsequent updates will overwrite/update this map
                    this.robotDataMap.set(p.id, { id: p.id, name: p.name, visuals: p.visuals });
                    console.log(`[Game Start] Stored initial data for robot ${p.id} (${p.name})`);
                } else {
                     console.warn(`[Game Start] Incomplete player data received for ID ${p.id}:`, p);
                }
            });
        } else {
             console.warn("[Game Start] No initial player data received in gameStart event.");
        }

        // Update UI state
        if (window.controls) window.controls.setState('playing');
        if (window.dashboard?.updateStats) window.dashboard.updateStats([], { gameName: this.gameName }); // Clear stats initially, show title
        if (this.renderer?.redrawArenaBackground) this.renderer.redrawArenaBackground(); // Clear scorch marks

        // Start the rendering loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /** Cleans up game state when a match ends */
    handleGameOver(data) {
        console.log(`[Game] Game Over: ${data.gameId}. Winner: ${data.winnerName}. Reason: ${data.reason}`);
        this.isRunning = false;
        this.gameId = null;
        this.gameName = null;
        this.activeFlashes = []; // Clear flashes on game over
        this.robotDataMap.clear(); // Clear robot data map

        // Update UI state
        if (window.controls) window.controls.setState('lobby');
        // Dashboard update will happen naturally as gameStateUpdate sends empty robot array
    }

    /**
     * Updates the client-side game state based on data received from the server.
     * @param {object} gameState - The game state object from the server.
     */
    updateFromServer(gameState) {
        // Ignore updates if the client isn't in an active game or spectating mode
        if (!this.isRunning && !this.isSpectating) return;

        // Ignore updates for a different game unless spectating that specific game
        const relevantGameId = this.isSpectating ? this.spectatingGameId : this.gameId;
        if (!relevantGameId || gameState.gameId !== relevantGameId) {
            // console.warn(`[Game] Ignoring state update for wrong game ID. Expected: ${relevantGameId}, Got: ${gameState.gameId}`);
            return;
        }

        this.lastGameStateTime = gameState.timestamp || Date.now(); // Use server time if available

        // Update core game objects
        this.robots = gameState.robots;
        this.missiles = gameState.missiles; // Missiles now have direction

        // --- Update robot data map (crucial for looking up visuals) ---
        this.robotDataMap.clear(); // Clear previous frame's map
        this.robots.forEach(robot => {
            // Store the entire robot data object received from the server
            // This ensures we have the latest visuals, name, etc.
            this.robotDataMap.set(robot.id, robot);
        });
        // --- End robot data map update ---

        // Process new explosions received from the server state
        if (gameState.explosions && Array.isArray(gameState.explosions)) {
            gameState.explosions.forEach(explosionData => {
                // Create the visual effect locally
                this.createExplosion(explosionData.x, explosionData.y, explosionData.size);
                 // Add scorch marks based on server-side explosion events
                 if (this.renderer?.addScorchMark) {
                    // Scale scorch radius based on explosion size
                    const scorchRadius = Math.max(5, explosionData.size * 8); // Adjust multiplier as needed
                    this.renderer.addScorchMark(explosionData.x, explosionData.y, scorchRadius);
                 }
            });
        }

        // --- Process Fire Events for Muzzle Flashes ---
        if (gameState.fireEvents && Array.isArray(gameState.fireEvents)) {
            gameState.fireEvents.forEach(event => {
                // Look up the firing robot's data from our map
                const ownerData = this.robotDataMap.get(event.ownerId);
                // Determine the turret type from the robot's visual data
                const turretType = ownerData?.visuals?.turret?.type || 'standard'; // Default if visuals missing

                // Create a new flash object to be rendered
                this.activeFlashes.push({
                    id: `f-${event.ownerId}-${Date.now()}`, // Unique ID for the flash
                    x: event.x,                             // Position where missile spawns
                    y: event.y,
                    direction: event.direction,             // Direction flash should point
                    type: turretType,                       // Type determines visual style
                    startTime: Date.now(),                  // Start time for duration calculation
                    duration: MUZZLE_FLASH_DURATION_MS      // How long the flash lasts
                });
            });
        }
        // --- End Fire Event Processing ---


        // Update the dashboard UI
        if (window.dashboard?.updateStats) {
            const currentContextName = this.isSpectating ? this.spectatingGameName : this.gameName;
            window.dashboard.updateStats(this.robots, { gameName: currentContextName });
        }

        // Make the latest robot data available to the renderer
        if(this.renderer) {
            this.renderer.robots = this.robots;
        }
    }


    /** Creates a local explosion effect object */
    createExplosion(x, y, power = 1) {
        const baseRadius = 10;
        const maxRadius = baseRadius * (2 + power * 1.5); // Scale radius with power
        const duration = 300 + power * 100; // Duration scales with power

        // Different color sequences based on power for more visual variety
        const colorSequence = power >= 3 ? ['#FFFFFF', '#FFA500', '#FF4500', '#8B0000', '#2c2c2c'] : // High power
                              power >= 2 ? ['#FFFFE0', '#FFD700', '#FFA500', '#FF0000', '#333333'] : // Medium power
                                           ['#FFFACD', '#FFF000', '#FFA500', '#444444'];              // Low power

        this.activeExplosions.push({
            x: x,
            y: y,
            maxRadius: maxRadius,
            startTime: Date.now(),
            duration: duration,
            colorSequence: colorSequence
        });
    }


    /** The main rendering loop */
    gameLoop() {
        // Stop the loop if the game isn't running or spectating
        if (!this.isRunning && !this.isSpectating) return;

        const now = Date.now();

        // --- Update and remove expired flashes ---
        // Filter out flashes whose duration has passed
        this.activeFlashes = this.activeFlashes.filter(flash => now < flash.startTime + flash.duration);
        // --- End flash update ---

        // Update and remove expired explosions (existing logic)
        this.activeExplosions = this.activeExplosions.filter(exp => now < exp.startTime + exp.duration);

        // Tell the renderer to draw the current state
        if (this.renderer) {
            // Pass all relevant game objects and effects to the renderer's draw method
            this.renderer.draw(this.missiles, this.activeExplosions, this.activeFlashes); // <<< Pass flashes
        }

        // Request the next animation frame to continue the loop
        if (this.isRunning || this.isSpectating) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    /** Stops the game loop and interpreter */
    stop() {
        console.log("[Game] Stopping game loop.");
        this.isRunning = false;
        this.interpreter.stop(); // Stop the interpreter if it was running code locally
    }

    /** Placeholder for client-side scan logic (if needed, usually server handles scans) */
    performScan(robot, direction, resolution) {
        // Client-side scan logic is typically not authoritative.
        // Scans are usually performed server-side.
        console.warn("[Game] performScan called on client - Scans are server-authoritative.");
        return null;
    }
}