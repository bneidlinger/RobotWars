// client/js/engine/game.js

/**
 * Client-side Game class for Robot Wars.
 * Manages the connection to the server, receives game state,
 * renders the game arena, handles robot destruction visuals & sounds, // <-- Updated description
 * processes sound events (fire, hit), and manages game lifecycle/spectating.
 * Does NOT run the simulation locally.
 */
class Game {
    /**
     * Creates a Game instance.
     * @param {string} arenaId - The ID of the HTML canvas element used for the arena.
     */
    constructor(arenaId) {
        try {
            this.renderer = new Arena(arenaId); // Use Arena class as the renderer
        } catch (error) {
            console.error("Failed to initialize Arena/Renderer:", error);
            alert(`Critical Error: Could not initialize game graphics.\n${error.message}`);
            this.renderer = null;
        }

        // Local game state representation
        this.robots = {}; // Key: robotId, Value: client-side robot data object
        this.missiles = []; // Array of missile data objects
        this.activeExplosions = []; // Array for explosion animation data

        // Client game flow state
        this.running = false;
        this.animationFrame = null;
        this.myPlayerId = null;
        this.lastServerState = null;
        this.gameId = null;
        this.gameName = null;

        // Ensure AudioManager is available globally (initialized in main.js)
        this.audioManager = window.audioManager;
        if (!this.audioManager) {
             console.warn("AudioManager not found on window. Sound effects will be disabled.");
        }
    }

    setPlayerId(id) {
        this.myPlayerId = id;
        console.log("My Player ID assigned:", this.myPlayerId);
    }

    /**
     * Updates local game state based on data from the server, including processing sound events.
     * @param {object} gameState - The game state object sent by the server.
     */
    updateFromServer(gameState) {
        if (!gameState || gameState.gameId !== this.gameId) return;

        this.lastServerState = gameState;
        this.gameName = gameState.gameName || this.gameName || gameState.gameId;

        // --- Update Robots ---
        const currentRobotIds = new Set();
        if (gameState.robots) {
            gameState.robots.forEach(serverRobotData => {
                const robotId = serverRobotData.id;
                currentRobotIds.add(robotId);
                let clientRobotData = this.robots[robotId] || { id: robotId };
                this.robots[robotId] = clientRobotData;

                // Update basic properties
                Object.assign(clientRobotData, {
                    x: serverRobotData.x,
                    y: serverRobotData.y,
                    direction: serverRobotData.direction,
                    damage: serverRobotData.damage,
                    color: serverRobotData.color,
                    appearance: serverRobotData.appearance || 'default',
                    name: serverRobotData.name || 'Unknown',
                    radius: 15,
                });

                // Preserve local destruction state if set
                if (clientRobotData.isDestroyed === undefined) clientRobotData.isDestroyed = !serverRobotData.isAlive;
                clientRobotData.visible = !clientRobotData.isDestroyed ? serverRobotData.isAlive : false;
            });
        }
        // Remove/hide robots no longer in server state
        for (const robotId in this.robots) {
            if (!currentRobotIds.has(robotId) && !this.robots[robotId].isDestroyed) {
                this.robots[robotId].visible = false;
            }
        }
        if (this.renderer) this.renderer.robots = Object.values(this.robots);

        // --- Update Missiles ---
        this.missiles = gameState.missiles ? gameState.missiles.map(m => ({ ...m })) : [];

        // START CHANGE: Process Sound Events ---
        // Fire Events
        if (this.audioManager && gameState.fireEvents && gameState.fireEvents.length > 0) {
            // Play one sound per batch for now to avoid cacophony, maybe refine later
            this.audioManager.playSound('fire');
            // Potential refinement: Play sound only if owner is visible? Or play based on distance?
            // gameState.fireEvents.forEach(event => {
            //     // Example: Play sound only for your own fires?
            //     // if (event.ownerId === this.myPlayerId) {
            //     //    this.audioManager.playSound('fire');
            //     // }
            // });
        }
        // Hit Events
        if (this.audioManager && gameState.hitEvents && gameState.hitEvents.length > 0) {
             // Play one sound per batch
             this.audioManager.playSound('hit');
            // Potential refinement: Play sound only if *you* were hit or hit someone?
            // gameState.hitEvents.forEach(event => {
                // Example: Check if targetId is this player
                // if (event.targetId === this.myPlayerId) {
                //     this.audioManager.playSound('hit');
                // }
            // });
        }
        // END CHANGE ---

        // --- Update Dashboard UI ---
        if (window.dashboard?.updateStats) {
             window.dashboard.updateStats(Object.values(this.robots), { gameName: this.gameName });
        }
    }

    /**
     * Handles the 'robotDestroyed' event: marks robot, triggers visuals and explosion sound.
     * @param {object} data - Data from server: { robotId, x, y, cause }
     */
    handleRobotDestroyed(data) {
        console.log(`[Game] Received robotDestroyed: ID=${data.robotId}, Pos=(${data.x}, ${data.y}), Cause=${data.cause}`);
        const robotData = this.robots[data.robotId];
        if (robotData) {
            robotData.isDestroyed = true;
            robotData.visible = false;
        } else {
            console.warn(`[Game] Received robotDestroyed for unknown ID: ${data.robotId}`);
        }

        // Trigger visual explosion effect
        this.addExplosionEffect(data.x, data.y, data.cause === 'selfDestruct' ? 5 : 3);

        // Trigger scorch mark
        if (this.renderer?.addScorchMark) {
            this.renderer.addScorchMark(data.x, data.y, 40);
        }

        // START CHANGE: Play explosion sound
        if (this.audioManager) {
            this.audioManager.playSound('explode');
        }
        // END CHANGE
    }

    /** Helper to add explosion data to the active list */
    addExplosionEffect(x, y, sizeMultiplier = 1) {
        this.activeExplosions.push({
            id: Date.now() + Math.random(),
            x: x, y: y,
            startTime: Date.now(),
            duration: 800, // ms
            maxRadius: 40 + (sizeMultiplier - 1) * 20,
            colorSequence: ['#FFFF99', '#FFA500', '#FF4500', '#8B0000', '#666666'],
        });
    }

    /** Main client-side rendering loop. */
    clientRenderLoop() {
        if (!this.running) return;
        if (!this.renderer) { this.stop(); return; }

        // Renderer draws background, robots, missiles, and effects
        this.renderer.draw(this.missiles, this.activeExplosions);

        this.animationFrame = requestAnimationFrame(this.clientRenderLoop.bind(this));
    }

    /** Starts the client-side rendering loop. */
    startRenderLoop() {
        if (this.running || !this.renderer) return;
        console.log("Starting client render loop...");
        this.running = true;
        this.clientRenderLoop();
    }

    /** Stops the client-side rendering loop. */
    stop() {
        if (!this.running) return;
        console.log("Stopping client render loop.");
        this.running = false;
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
    }

    /** Clears local game state and resets renderer/dashboard */
    clearLocalState() {
        console.log("Clearing local game state...");
        this.activeExplosions = [];
        this.robots = {};
        this.missiles = [];
        this.lastServerState = null;
        this.gameId = null;
        this.gameName = null;

        if (this.renderer) {
            this.renderer.robots = [];
            // Scorch marks persist until next background redraw
            this.renderer.clear(); // Draw background/grid immediately
        }
        if (window.dashboard?.updateStats) {
            window.dashboard.updateStats([], {});
        }
    }

    // --- Game Lifecycle & Spectator Handlers ---

    handleGameStart(data) {
        console.log("Game Start signal received:", data);
        this.stop();
        this.clearLocalState();
        this.gameId = data.gameId;
        this.gameName = data.gameName || data.gameId;

        // Initialize robots map
        if (data.players) {
             data.players.forEach(p => {
                 this.robots[p.id] = { ...p, x:0, y:0, direction:0, damage:0, color:'#ccc', isAlive: true, isDestroyed: false, visible: true, radius: 15 };
             });
             if (this.renderer) this.renderer.robots = Object.values(this.robots);
        }
        // Redraw background to clear old scorch marks
        if (this.renderer?.redrawArenaBackground) this.renderer.redrawArenaBackground();

        this.startRenderLoop();
        if (controls?.setState) controls.setState('playing');
        if (window.updateLobbyStatus) window.updateLobbyStatus(`${data.isTestGame ? 'Testing Code:' : 'Playing Game:'} ${this.gameName}`);
    }

    handleGameOver(data) {
        console.log("Game Over signal received (as player):", data);
        this.stop(); // Stop rendering loop

        let winnerDisplayName = data.winnerName || (data.winnerId ? `ID: ${data.winnerId.substring(0, 6)}...` : 'None');
        const endedGameName = this.gameName || data.gameId;
        alert(`Game '${endedGameName}' Over! ${data.reason || 'Match ended.'} Winner: ${winnerDisplayName}`);

        if (controls?.setState) controls.setState('lobby');
        const prompt = data.wasTestGame ? 'Test Complete. Ready Up or Test Again!' : 'Game Over. Ready Up for another match!';
        if (window.updateLobbyStatus) window.updateLobbyStatus(prompt);

        this.clearLocalState(); // Clear state AFTER showing alert
    }

    handleSpectateStart(spectateData) {
        console.log("Starting spectate mode for game:", spectateData);
        this.stop();
        this.clearLocalState();
        this.gameId = spectateData.gameId;
        this.gameName = spectateData.gameName || spectateData.gameId;
        if (this.renderer?.redrawArenaBackground) this.renderer.redrawArenaBackground();
        if (controls?.setState) controls.setState('spectating');
        if (window.updateLobbyStatus) window.updateLobbyStatus(`Spectating Game: ${this.gameName}`);
        this.startRenderLoop();
    }

    handleSpectateEnd(gameOverData) {
        console.log("Spectate mode ended:", gameOverData);
        this.stop();
        if (controls?.setState) controls.setState('lobby');
        if (window.updateLobbyStatus) window.updateLobbyStatus('Returned to Lobby. Ready Up!');

        let winnerDisplayName = gameOverData.winnerName || (gameOverData.winnerId ? `ID: ${gameOverData.winnerId.substring(0, 6)}...` : 'None');
        const endedGameName = this.gameName || gameOverData.gameId;
        alert(`Spectated game '${endedGameName}' finished!\nWinner: ${winnerDisplayName}. (${gameOverData.reason || 'Match ended.'})`);

        this.clearLocalState();
    }

} // End Game Class