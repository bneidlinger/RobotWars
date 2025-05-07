// server/game-manager.js
const GameInstance = require('./game-instance');
const fs = require('fs');
const path = require('path');
const StatsManager = require('./stats-manager');

/**
 * Manages the overall flow of players joining, waiting, and starting games.
 * Handles storing player data (including loadout visuals, name, code, readiness), // <-- Updated description
 * matchmaking, game naming, tracking active/finished games, cleaning up old instances,
 * starting single-player test games, handling self-destruct requests,
 * transitioning lobby players to spectators, moving participants back to lobby,
 * broadcasting game history, and broadcasting lobby events and status updates.
 */
class GameManager {
    constructor(io, db) {
        this.io = io;
        this.db = db;
        // Stores players waiting to join a game.
        // Key: socket.id
        // Value: { socket: SocketIO.Socket, loadout: { visuals: object, code: string, name: string }, isReady: boolean } // <-- Updated value structure
        this.pendingPlayers = new Map();
        this.activeGames = new Map();
        this.playerGameMap = new Map();
        this.gameIdCounter = 0;
        this.recentlyCompletedGames = new Map();
        this.maxCompletedGames = 10;
        
        // Bot profiles map
        this.botProfiles = new Map();
        
        // Initialize the stats manager if database is available
        this.statsManager = db ? new StatsManager(db) : null;
        
        // Load all bot profiles
        this.loadBotProfiles();
        
        console.log("[GameManager] Initialized." + (this.statsManager ? " Stats tracking enabled." : " Stats tracking disabled - no database."));
    }
    
    /**
     * Loads all bot AI profiles from the bot-profiles directory
     */
    loadBotProfiles() {
        try {
            // Load standard bot (legacy location)
            try {
                this.botProfiles.set('standard', fs.readFileSync(path.join(__dirname, 'dummy-bot-ai.js'), 'utf8'));
                console.log("[GameManager] Standard bot AI loaded from legacy location.");
            } catch (err) {
                console.error("[GameManager] FAILED TO LOAD standard bot from legacy location:", err);
            }
            
            // Load from bot-profiles directory
            const profilesDir = path.join(__dirname, 'bot-profiles');
            
            // Check if directory exists
            if (!fs.existsSync(profilesDir)) {
                console.error(`[GameManager] Bot profiles directory not found: ${profilesDir}`);
                return;
            }
            
            // Get all .js files in the profiles directory
            const profileFiles = fs.readdirSync(profilesDir).filter(file => file.endsWith('.js'));
            
            // Read each profile file
            profileFiles.forEach(file => {
                try {
                    const profileName = file.replace('.js', '');
                    const profileCode = fs.readFileSync(path.join(profilesDir, file), 'utf8');
                    this.botProfiles.set(profileName, profileCode);
                    console.log(`[GameManager] Bot profile loaded: ${profileName}`);
                } catch (err) {
                    console.error(`[GameManager] FAILED TO LOAD bot profile ${file}:`, err);
                }
            });
            
            // Fallback for standard if not found
            if (!this.botProfiles.has('standard')) {
                this.botProfiles.set('standard', "// Fallback Bot AI\nconsole.log('Fallback Bot AI Active'); robot.drive(Math.random() * 360, 2);");
                console.error("[GameManager] Using fallback code for standard bot profile!");
            }
            
            console.log(`[GameManager] Loaded ${this.botProfiles.size} bot profiles.`);
            
        } catch (err) {
            console.error("[GameManager] Error loading bot profiles:", err);
            // Set fallback standard bot
            this.botProfiles.set('standard', "// Fallback Bot AI\nconsole.log('Fallback Bot AI Active'); robot.drive(Math.random() * 360, 2);");
        }
    }

    /** Adds player to pending list with default/empty loadout */
    addPlayer(socket) {
        if (this.pendingPlayers.has(socket.id)) return;
        const initialName = `Player_${socket.id.substring(0, 4)}`;
        console.log(`[GameManager] Adding player ${socket.id} (${initialName}) back to pending list.`);
        this.pendingPlayers.set(socket.id, {
            socket: socket,
            // Initialize with an empty/default loadout structure
            loadout: {
                name: initialName, // Client should provide real name on ready
                visuals: null,     // Will be set on ready
                code: null         // Will be set on ready
            },
            isReady: false
        });
        // Broadcast status after adding
        this.broadcastLobbyStatus();
    }

    /** Generates unique game name */
    generateGameName() {
        const baseId = 137 + this.gameIdCounter;
        return `Sector Z-${baseId}`;
    }

    /** Retrieves player name (checks pending and active) */
    getPlayerName(socketId) {
        const pendingData = this.pendingPlayers.get(socketId);
        // Access name within the nested loadout object
        if (pendingData?.loadout?.name) return pendingData.loadout.name;

        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            const activePlayerData = game?.players?.get(socketId);
             // Access name within the nested loadout object stored in GameInstance
            if (activePlayerData?.loadout?.name) return activePlayerData.loadout.name;
            // Fallback check on gameInstance.playerNames (if still used)
            if (game?.playerNames?.get(socketId)) return game.playerNames.get(socketId);
        }
        return null;
    }

    /**
     * Handles receiving loadout data from a player upon "Ready Up".
     * Updates the player's status and loadout, then attempts matchmaking.
     * Called by socket-handler when 'submitPlayerData' is received.
     * @param {string} socketId - The ID of the player submitting data.
     * @param {object} loadoutData - The complete loadout object { name, visuals, code }.
     */
    handlePlayerCode(socketId, loadoutData) { // Renamed param for clarity
        const playerData = this.pendingPlayers.get(socketId);
        if (!playerData) {
            console.log(`[GameManager] Received data from non-pending player: ${socketId}. Ignoring.`);
            return;
        }

        // --- Update player data with the received loadout ---
        // Replace the entire loadout object, ensuring validation happened in socket-handler
        playerData.loadout = loadoutData;
        playerData.isReady = true; // Mark player as ready

        console.log(`[GameManager] Player ${playerData.loadout.name} (${socketId}) submitted loadout and is Ready.`);
        this.io.emit('lobbyEvent', { message: `Player ${playerData.loadout.name} is ready!` });
        this._tryStartMatch();
        this.broadcastLobbyStatus();
    }

    /** Sets player ready status */
    setPlayerReadyStatus(socketId, isReady) {
        const playerData = this.pendingPlayers.get(socketId);
        if (playerData && playerData.isReady !== isReady) {
            playerData.isReady = isReady;
            const playerName = playerData.loadout?.name || socketId.substring(0,4)+'...'; // Use loadout name if available
            console.log(`[GameManager] Player ${playerName} (${socketId}) status set to ${isReady ? 'Ready' : 'Not Ready'}.`);
            this.io.emit('lobbyEvent', { message: `Player ${playerName} is ${isReady ? 'now ready' : 'no longer ready'}.` });
            if (isReady) this._tryStartMatch();
            this.broadcastLobbyStatus();
        }
    }

    /** Internal method to try starting a match */
    _tryStartMatch() {
        const readyPlayers = Array.from(this.pendingPlayers.values()).filter(p => p.isReady);
        const requiredPlayers = 2;
        if (readyPlayers.length >= requiredPlayers) {
            console.log(`[GameManager] ${readyPlayers.length}/${requiredPlayers} players ready. Starting new game...`);
            const playersForGame = readyPlayers.slice(0, requiredPlayers);
            playersForGame.forEach(p => this.pendingPlayers.delete(p.socket.id));
            this.createGame(playersForGame); // createGame now expects the new playerData structure
        }
    }

    /**
     * Creates a new GameInstance using the provided player data (including loadouts).
     * @param {Array<{socket: SocketIO.Socket, loadout: object, isReady: boolean}>} playersData - Array of player data objects for the new game.
     */
    createGame(playersData) {
        const gameId = `game-${this.gameIdCounter++}`;
        const gameName = this.generateGameName();
        // Use loadout name for player info string
        const playerInfo = playersData.map(p => `${p.loadout.name}(${p.socket.id.substring(0,4)})`).join(', ');
        console.log(`[GameManager] Creating game ${gameId} ('${gameName}') for players: ${playerInfo}`);
        const playerNames = playersData.map(p => p.loadout.name).join(' vs ');
        this.io.emit('lobbyEvent', { message: `Game '${gameName}' starting: ${playerNames}!` });

        let gameInstance;
        try {
            // --- Pass the whole playerData array (containing loadouts) to GameInstance ---
            gameInstance = new GameInstance(
                gameId, this.io, playersData, // Pass the full player data array
                (endedGameId, winnerData) => { this.handleGameOverEvent(endedGameId, winnerData); },
                gameName
            );
            this.activeGames.set(gameId, gameInstance);

            // Map participants and notify them (include loadout info?)
            playersData.forEach(player => {
                this.playerGameMap.set(player.socket.id, gameId);
                 if (player.socket.connected) {
                     player.socket.emit('gameStart', {
                         gameId: gameId, gameName: gameName,
                         // Send relevant player info, maybe including visuals for initial display?
                         players: playersData.map(p => ({
                            id: p.socket.id,
                            name: p.loadout.name,
                            visuals: p.loadout.visuals // Send initial visuals
                         }))
                     });
                     console.log(`[GameManager] Notified player ${player.loadout.name} game ${gameId} starting.`);
                 } else { console.warn(`[GameManager] Player ${player.loadout.name} disconnected before gameStart emit.`); }
            });

            // Transition remaining lobby players to spectators (No change needed here)
            const spectatorRoom = `spectator-${gameId}`;
            const remainingPendingPlayers = Array.from(this.pendingPlayers.values());
            if (remainingPendingPlayers.length > 0) {
                console.log(`[GameManager] Moving ${remainingPendingPlayers.length} remaining pending players to spectate game ${gameId}.`);
                remainingPendingPlayers.forEach(pendingPlayer => {
                    const spectatorSocket = pendingPlayer.socket;
                    const spectatorId = spectatorSocket.id;
                    const spectatorName = pendingPlayer.loadout?.name || spectatorId.substring(0,4)+'...'; // Use name
                    if (this.pendingPlayers.has(spectatorId)) {
                        if (spectatorSocket.connected) {
                             spectatorSocket.join(spectatorRoom);
                             spectatorSocket.emit('spectateStart', { gameId: gameId, gameName: gameName });
                             this.pendingPlayers.delete(spectatorId);
                             console.log(`[GameManager] Moved pending player ${spectatorName} (${spectatorId}) to spectate.`);
                        } else {
                             console.log(`[GameManager] Pending player ${spectatorName} (${spectatorId}) disconnected before spectate move. Removing.`);
                             this.pendingPlayers.delete(spectatorId);
                        }
                    }
                });
            }

            gameInstance.startGameLoop();
            this.broadcastLobbyStatus();

        } catch (error) {
            console.error(`[GameManager] Error creating game ${gameId} ('${gameName}'):`, error);
            this.io.emit('lobbyEvent', { message: `Failed to start game '${gameName}' for ${playerInfo}. Please try again.`, type: 'error' });
            // Put players back in pending if creation failed
            playersData.forEach(player => {
                 if (player.socket) {
                     player.isReady = false;
                     // Add back with the loadout data they submitted? Or reset? Reset is safer.
                     this.addPlayer(player.socket); // addPlayer resets loadout/ready state
                     if(player.socket.connected) {
                        player.socket.emit('gameError', { message: `Failed to create game instance '${gameName}'. Please Ready Up again.` });
                     }
                 }
            });
            if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
            playersData.forEach(player => { if (player.socket) this.playerGameMap.delete(player.socket.id); });
            this.broadcastLobbyStatus();
        }
    } // End createGame

    /**
     * Starts a single-player test game using the player's submitted loadout.
     * Called by socket-handler when 'requestTestGame' is received.
     * @param {SocketIO.Socket} playerSocket - The socket of the player requesting the test.
     * @param {object} playerLoadout - The complete loadout object { name, visuals, code, botProfile }.
     */
    startTestGameForPlayer(playerSocket, playerLoadout) { // Updated parameter
        const playerId = playerSocket.id;
        const botProfile = playerLoadout.botProfile || 'standard';
        console.log(`[GameManager] Starting test game for player ${playerLoadout.name} (${playerId}) against bot profile "${botProfile}"`);

        if (!this.pendingPlayers.delete(playerId)) {
             console.warn(`[GameManager] Player ${playerLoadout.name} (${playerId}) requested test game but wasn't pending. Aborting.`);
             playerSocket.emit('lobbyEvent', { message: "Cannot start test game - state conflict.", type: "error" });
             return;
        }

        const gameId = `test-${this.gameIdCounter++}`;
        const gameName = `Test Arena ${gameId.split('-')[1]}`;

        // 1. Prepare Player Data for GameInstance (using the provided loadout)
        const playerGameData = {
            socket: playerSocket,
            loadout: playerLoadout, // Pass the whole submitted loadout
            isReady: true
        };

        // 2. Get the bot profile code
        let botCode = this.botProfiles.get(botProfile);
        if (!botCode) {
            console.warn(`[GameManager] Bot profile "${botProfile}" not found, using standard profile.`);
            botCode = this.botProfiles.get('standard');
            // If standard not found either, use simple fallback
            if (!botCode) {
                botCode = "// Fallback Bot AI\nconsole.log('Fallback Bot AI Active'); robot.drive(Math.random() * 360, 2);";
            }
        }

        // 3. Configure bot visuals based on profile
        let botVisuals;
        switch (botProfile) {
            case 'aggressive':
                botVisuals = {
                    turret: { type: 'cannon', color: '#842c1c' },
                    chassis: { type: 'heavy', color: '#c63926' },
                    mobility: { type: 'treads' }
                };
                break;
            case 'defensive':
                botVisuals = {
                    turret: { type: 'dual', color: '#1a3c6b' },
                    chassis: { type: 'heavy', color: '#2c5aa0' },
                    mobility: { type: 'treads' }
                };
                break;
            case 'sniper':
                botVisuals = {
                    turret: { type: 'laser', color: '#1e4334' },
                    chassis: { type: 'light', color: '#3a7563' },
                    mobility: { type: 'hover' }
                };
                break;
            case 'erratic':
                botVisuals = {
                    turret: { type: 'missile', color: '#5b2c75' },
                    chassis: { type: 'triangular', color: '#8e44ad' },
                    mobility: { type: 'legs' }
                };
                break;
            case 'stationary':
                botVisuals = {
                    turret: { type: 'standard', color: '#566566' },
                    chassis: { type: 'medium', color: '#7e8c8d' },
                    mobility: { type: 'wheels' }
                };
                break;
            case 'standard':
            default:
                botVisuals = {
                    turret: { type: 'standard', color: '#888888' },
                    chassis: { type: 'medium', color: '#555555' },
                    mobility: { type: 'treads' }
                };
                break;
        }

        // 4. Prepare Dummy Bot Data with the selected profile
        const dummyBotId = `dummy-bot-${gameId}`;
        const dummyBotGameData = {
            socket: null,
            // Define the dummy bot's loadout structure
            loadout: {
                name: `${botProfile.charAt(0).toUpperCase() + botProfile.slice(1)} Bot`,
                visuals: botVisuals,
                code: botCode
            },
            isReady: true
        };

        // 3. Create the GameInstance
        console.log(`[GameManager] Creating test game ${gameId} ('${gameName}')`);
        this.io.emit('lobbyEvent', { message: `Test game '${gameName}' starting for ${playerLoadout.name}!` });
        try {
             const gameInstance = new GameInstance(
                 gameId, this.io,
                 [playerGameData, dummyBotGameData], // Pass data for both participants
                 (endedGameId, winnerData) => {
                      winnerData.wasTestGame = true; // Ensure flag is set
                      this.handleGameOverEvent(endedGameId, winnerData);
                 },
                 gameName,
                 true // Explicitly set isTestGame flag for GameInstance constructor
             );

            this.activeGames.set(gameId, gameInstance);
            this.playerGameMap.set(playerId, gameId);

            // Send 'gameStart' only to the player
            playerSocket.emit('gameStart', {
                gameId: gameId, gameName: gameName, isTestGame: true,
                players: [ // Send info including visuals
                     { id: playerId, name: playerLoadout.name, visuals: playerLoadout.visuals },
                     { id: dummyBotId, name: dummyBotGameData.loadout.name, visuals: dummyBotGameData.loadout.visuals }
                ]
            });

            gameInstance.startGameLoop();
            this.broadcastLobbyStatus();

        } catch (error) {
             console.error(`[GameManager] Error creating test game ${gameId} ('${gameName}'):`, error);
             this.io.emit('lobbyEvent', { message: `Failed to start test game '${gameName}' for ${playerLoadout.name}. Please try again.`, type: 'error' });
             // Put player back in pending (using addPlayer resets their state)
             this.addPlayer(playerSocket);
             if(playerSocket.connected) {
                playerSocket.emit('gameError', { message: `Failed to create test game instance '${gameName}'. Please Ready Up or Test again.` });
             }
             if (this.activeGames.has(gameId)) { this.activeGames.delete(gameId); }
             this.playerGameMap.delete(playerId);
             this.broadcastLobbyStatus();
        }
    } // End startTestGameForPlayer


    /** Handles game over: moves players/spectators, cleans up, logs history */
    async handleGameOverEvent(gameId, winnerData) {
        const gameInstance = this.activeGames.get(gameId);
        const gameName = gameInstance ? gameInstance.gameName : `Game ${gameId}`;
        const isTestGame = winnerData.wasTestGame || false;
        const winnerName = winnerData.winnerName || 'No one';
        const reason = winnerData.reason || 'Match ended.';
        console.log(`[GameManager] Received game over event for ${gameId} ('${gameName}'). Winner: ${winnerName}. TestGame: ${isTestGame}`);

        const lobbyMsg = isTestGame ? `Test game '${gameName}' over! Winner: ${winnerName}. (${reason})` : `Game '${gameName}' over! Winner: ${winnerName}. (${reason})`;
        this.io.emit('lobbyEvent', { message: lobbyMsg });

        if (!gameInstance) {
            console.warn(`[GameManager] handleGameOverEvent called for ${gameId}, but instance not found. Skipping cleanup.`);
            this.broadcastLobbyStatus();
            return;
        }

        // Move Spectators Back
        const spectatorRoom = `spectator-${gameId}`;
        try {
            const spectatorSockets = await this.io.in(spectatorRoom).fetchSockets();
            console.log(`[GameManager] Found ${spectatorSockets.length} spectators for game ${gameId}. Moving to lobby.`);
            spectatorSockets.forEach(s => {
                if (s.connected) { s.leave(spectatorRoom); this.addPlayer(s); }
            });
        } catch (err) { console.error(`[GameManager] Error fetching/moving spectators for ${gameId}:`, err); }

        // Clean up Player Mappings & Move REAL Participants to Lobby
        const playerIds = Array.from(gameInstance.players.keys());
        console.log(`[GameManager] Cleaning up mappings/moving participants for game ${gameId}:`, playerIds);
        playerIds.forEach(playerId => {
            this.playerGameMap.delete(playerId);
            const playerData = gameInstance.players.get(playerId);
            const playerSocket = playerData ? playerData.socket : null;
            // Add back only if they have a socket and are connected (skips dummy bot)
            if (playerSocket && playerSocket.connected) {
                 console.log(`[GameManager] Adding participant ${playerId} back to pendingPlayers.`);
                 this.addPlayer(playerSocket); // addPlayer resets their state
            } else {
                 console.log(`[GameManager] Participant ${playerId} (socket: ${playerSocket ? 'exists' : 'no'}, connected: ${playerSocket?.connected}) not added back to lobby.`);
            }
        });

        // Log completed game and update stats
        if (gameInstance?.players) {
            // Extract additional data for stats tracking
            const gameEndTime = Date.now();
            const gameData = {
                name: gameName,
                id: gameId,
                startTime: gameInstance.startTime || (gameEndTime - 60000), // Default to 1 minute ago
                endTime: gameEndTime,
                winnerName: winnerName,
                isTestGame: isTestGame,
                // Enhanced player data for stats tracking
                players: Array.from(gameInstance.players.values()).map(p => {
                    // Get user ID from socket session if available
                    const userId = p.socket?.request?.session?.userId;
                    return {
                        id: p.robot.id,
                        name: p.loadout.name,
                        userId: userId,
                        code: p.loadout.code,
                        died: p.robot.health <= 0,
                        kills: p.robot.kills || 0,
                        isBot: !p.socket // If no socket, it's a bot
                    };
                })
            };
            
            // Update appropriate stats based on game type
            if (this.statsManager) {
                if (isTestGame) {
                    // Update bot challenge stats
                    this.statsManager.updateBotStats(gameData, winnerData)
                        .catch(err => console.error("[GameManager] Error updating bot stats:", err));
                } else {
                    // Update PvP stats for real games
                    this.statsManager.updatePvPStats(gameData, winnerData)
                        .catch(err => console.error("[GameManager] Error updating PvP stats:", err));
                }
                
                // Update code efficiency stats for both game types if there's a winner
                if (winnerData.winnerId) {
                    this.statsManager.updateCodeStats(gameData, winnerData)
                        .catch(err => console.error("[GameManager] Error updating code stats:", err));
                }
            }
            
            // Only add non-test games to public history
            if (!isTestGame) {
                // Simplified version for history display
                const completedGameData = {
                    name: gameName,
                    winnerName: winnerName,
                    players: gameData.players.map(p => ({ id: p.id, name: p.name })),
                    endTime: gameEndTime
                };
                
                this.recentlyCompletedGames.set(gameId, completedGameData);
                while (this.recentlyCompletedGames.size > this.maxCompletedGames) {
                    const oldestGameId = this.recentlyCompletedGames.keys().next().value;
                    this.recentlyCompletedGames.delete(oldestGameId);
                }
                console.log(`[GameManager] Logged completed game: ${gameId} ('${gameName}')`);
                this.broadcastGameHistory(); // Broadcast if non-test game ended
            } else {
                console.log(`[GameManager] Test game ${gameId} ('${gameName}') ended. Not adding to public history.`);
            }
            
            // Broadcast leaderboard update to all clients
            if (this.statsManager) {
                this.io.emit('leaderboardUpdate');
            }
        }

        // Clean up Game Instance
        try { if (gameInstance) gameInstance.cleanup(); }
        catch(err) { console.error(`[GameManager] Error during gameInstance.cleanup() for ${gameId}:`, err); }
        this.activeGames.delete(gameId);
        console.log(`[GameManager] Game instance ${gameId} ('${gameName}') fully removed.`);

        this.broadcastLobbyStatus(); // Broadcast after cleanup
    }

     /** Broadcasts game history */
     broadcastGameHistory() {
         const historyArray = Array.from(this.recentlyCompletedGames.values())
                                 .sort((a, b) => b.endTime - a.endTime);
         this.io.emit('gameHistoryUpdate', historyArray);
     }

    /** Removes disconnected player */
    removePlayer(socketId) {
        const playerName = this.getPlayerName(socketId);
        const wasPending = this.pendingPlayers.delete(socketId);
        const gameId = this.playerGameMap.get(socketId);

        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game) {
                console.log(`[GameManager] Removing player ${playerName || socketId} from active game ${gameId} ('${game.gameName}')`);
                game.removePlayer(socketId);
                if (game.isEmpty()) {
                    console.log(`[GameManager] Active game ${gameId} became empty. Triggering cleanup.`);
                    this.handleGameOverEvent(gameId, { winnerId: null, winnerName: 'None', reason: 'Player Disconnected', wasTestGame: game.isTestGame });
                }
            }
            this.playerGameMap.delete(socketId);
        }

        if (wasPending) {
            console.log(`[GameManager] Player ${playerName || socketId} removed from pending list.`);
             this._tryStartMatch(); // Re-evaluate matchmaking
        } else if (!gameId) {
             console.log(`[GameManager] Removed player ${playerName || socketId} (was not pending or in active game map).`);
        }
        // Calling handler broadcasts lobby status
    }

    /** Broadcasts lobby status */
    broadcastLobbyStatus() {
        const totalPending = this.pendingPlayers.size;
        const readyCount = Array.from(this.pendingPlayers.values()).filter(p => p.isReady).length;
        const statusData = { waiting: totalPending, ready: readyCount };
        this.io.emit('lobbyStatusUpdate', statusData);
    }

    /** Handles player actions (placeholder) */
    handlePlayerAction(socketId, action) {
        // Not currently used
    }

    /** Handles self-destruct request */
    handleSelfDestruct(socketId) {
        const gameId = this.playerGameMap.get(socketId);
        if (gameId) {
            const game = this.activeGames.get(gameId);
            if (game?.triggerSelfDestruct) {
                console.log(`[GameManager] Relaying self-destruct for ${socketId} to game ${gameId}`);
                game.triggerSelfDestruct(socketId);
            } else { console.warn(`[GameManager] Game instance ${gameId} missing triggerSelfDestruct for ${socketId}.`); }
        }
    }

} // End GameManager Class

module.exports = GameManager;