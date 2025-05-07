// client/js/network.js

/**
 * Handles client-side network communication with the server using Socket.IO.
 * Connects to the server, sends player loadout data (visuals, name, code), readiness signals,
 * requests test games, sends self-destruct signals, receives game state updates,
 * handles spectating, processes lobby/chat events, handles robot destruction events,
 * receives game history updates, and handles robot log messages (for both player and opponent).
 */
class Network {
    /**
     * Creates a Network instance.
     * @param {Game} game - Reference to the main client-side game object.
     */
    constructor(game) {
        this.socket = null;
        this.playerId = null; // This will be set by the 'assignId' event
        this.game = game;
        this.isSpectating = false;
        this.spectatingGameId = null;
        this.spectatingGameName = null;
        if (!this.game) {
            console.error("Network handler initialized without a valid game reference!");
        }
    }

    /**
     * Establishes the WebSocket connection to the server and sets up event listeners.
     */
    connect() {
        try {
            // Prevent multiple connections if already connecting or connected
            if (this.socket && (this.socket.connecting || this.socket.connected)) {
                console.log("Network: Already connected or connecting. Ignoring connect() call.");
                return;
            }

            console.log("Network: Attempting to connect...");
            this.socket = io({
                 reconnectionAttempts: 5,
                 reconnectionDelay: 1000,
                 reconnectionDelayMax: 5000,
                 // Optional: Add transports if experiencing connection issues on some platforms
                 // transports: ['websocket', 'polling']
            });

            // --- Socket.IO Event Listeners ---

            this.socket.on('connect', () => {
                console.log('Successfully connected/reconnected to server with Socket ID:', this.socket.id);
                this.isSpectating = false;
                this.spectatingGameId = null;
                this.spectatingGameName = null;
                // Reset playerId on new connection until assigned
                this.playerId = null;
                if (typeof controls?.setState === 'function') controls.setState('lobby');
                if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Connected. Waiting for server info...');
                if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage("--> Connected to server.", "event");
                if (typeof window.clearRobotLog === 'function') window.clearRobotLog();
                if (typeof window.clearOpponentLog === 'function') window.clearOpponentLog();
            });

            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
                if (this.game) this.game.stop();
                this.isSpectating = false;
                this.spectatingGameId = null;
                this.spectatingGameName = null;
                this.playerId = null; // Clear player ID on disconnect
                if (typeof controls?.setState === 'function') controls.setState('lobby');
                if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`Disconnected: ${reason}. Reconnecting...`);
                if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Disconnected: ${reason}. Attempting to reconnect...`, "error");
            });

            this.socket.on('assignId', (id) => {
                console.log('Server assigned Player ID:', id);
                this.playerId = id; // Set the player ID for this client session
                if (this.game?.setPlayerId) this.game.setPlayerId(id);
                // Update status only if we are in lobby state after getting ID
                if (!this.isSpectating && controls?.uiState === 'lobby' && typeof window.updateLobbyStatus === 'function') {
                    window.updateLobbyStatus('Enter name & code, then Ready Up or Test Code!');
                }
            });

            // --- START: Robot Log Handler ---
            this.socket.on('robotLog', (data) => {
                 // Validate incoming data
                 if (data && typeof data.message === 'string' && typeof data.robotId === 'string') {
                     // Check if this client has been assigned an ID yet
                     if (!this.playerId) {
                         console.warn("Received robotLog before playerId was assigned. Log may be misdirected.");
                         // Optionally, buffer logs until playerId is known, or just log to general event log?
                         // For now, maybe log to player console as a fallback if it's the only one available
                         if (typeof window.addRobotLogMessage === 'function') {
                            window.addRobotLogMessage(`(Early Log from ${data.robotId.substring(0,4)}...): ${data.message}`);
                         }
                         return;
                     }

                     // Route the log based on comparison with the client's own ID
                     if (data.robotId === this.playerId) {
                         // It's a message from the player's own robot
                         if (typeof window.addRobotLogMessage === 'function') {
                            window.addRobotLogMessage(data.message);
                         } else {
                            console.warn("addRobotLogMessage function not found!");
                         }
                     } else {
                         // It's a message from the opponent's robot
                         if (typeof window.addOpponentLogMessage === 'function') {
                             window.addOpponentLogMessage(data.message);
                         } else {
                            console.warn("addOpponentLogMessage function not found!");
                         }
                     }
                 } else {
                    console.warn("Received invalid robotLog data format:", data);
                 }
             });
            // --- END: Robot Log Handler ---


            // ... other event handlers remain the same ...

            this.socket.on('spectateStart', (data) => {
                console.log('Received spectateStart:', data);
                if (this.game?.handleSpectateStart) {
                    this.isSpectating = true;
                    this.spectatingGameId = data.gameId;
                    this.spectatingGameName = data.gameName || data.gameId;
                    this.game.handleSpectateStart(data);
                    if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Started spectating game: ${this.spectatingGameName}`, 'event');
                    if (typeof window.clearRobotLog === 'function') window.clearRobotLog();
                    if (typeof window.clearOpponentLog === 'function') window.clearOpponentLog();
                } else { console.error("Game object or handleSpectateStart method not available!"); }
            });

            this.socket.on('spectateGameOver', (data) => {
                console.log('Received spectateGameOver:', data);
                if (this.isSpectating && this.spectatingGameId === data.gameId) {
                     if (this.game?.handleSpectateEnd) {
                         this.game.handleSpectateEnd(data);
                         if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Spectated game '${this.spectatingGameName || data.gameId}' over! Winner: ${data.winnerName || 'None'}`, 'event');
                     } else { console.error("Game object or handleSpectateEnd method not available!"); }
                     this.isSpectating = false;
                     this.spectatingGameId = null;
                     this.spectatingGameName = null;
                 }
            });

            this.socket.on('gameStateUpdate', (gameState) => {
                if (this.game?.updateFromServer) {
                     const relevantGameId = this.isSpectating ? this.spectatingGameId : this.game.gameId;
                     // Ensure gameState and gameId exist before comparing
                     if (relevantGameId && gameState && relevantGameId === gameState.gameId) {
                        this.game.updateFromServer(gameState);
                     }
                }
            });

             this.socket.on('gameStart', (data) => {
                 if (this.isSpectating) { console.log("Received gameStart while spectating, ignoring."); return; }
                 // Ensure data is valid before proceeding
                 if (!data || !data.gameId) { console.warn("Received invalid gameStart data:", data); return; }
                 if (this.game?.handleGameStart) this.game.handleGameStart(data);
                 const statusPrefix = data.isTestGame ? 'Testing Code vs AI:' : 'Playing Game:';
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`${statusPrefix} ${data.gameName || data.gameId}`);
                 if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Your game '${data.gameName || data.gameId}' is starting!`, 'event');
                 if (typeof window.clearRobotLog === 'function') window.clearRobotLog();
                 if (typeof window.clearOpponentLog === 'function') window.clearOpponentLog();
             });

             this.socket.on('gameOver', (data) => {
                 if (this.isSpectating) { console.log("Received gameOver while spectating, ignoring."); return; }
                 // Ensure data is valid and matches current game
                 if (!data || !data.gameId) { console.warn("Received invalid gameOver data:", data); return; }
                 if (this.game && this.game.gameId === data.gameId) {
                     if (typeof this.game.handleGameOver === 'function') this.game.handleGameOver(data);
                     const prompt = data.wasTestGame ? 'Test Complete. Ready Up or Test Again!' : 'Game Over. Ready Up for another match!';
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(prompt);
                     if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Your game '${this.game.gameName || data.gameId}' finished! Winner: ${data.winnerName || 'None'}`, 'event');
                 } else { console.warn(`Received gameOver for game ${data.gameId}, but current game is ${this.game ? this.game.gameId : 'None'}. Ignoring.`); }
             });

            this.socket.on('robotDestroyed', (data) => {
                 if (!data || !data.robotId) { console.warn("Received invalid robotDestroyed data:", data); return; }
                if (this.game?.handleRobotDestroyed) this.game.handleRobotDestroyed(data);
                else console.warn("Received robotDestroyed event, but game object or handler missing.");
            });

            this.socket.on('codeError', (data) => {
                if (!data || !data.robotId || typeof data.message !== 'string') { console.warn("Received invalid codeError data:", data); return; }
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                // Use playerId for comparison
                const robotIdentifier = (this.playerId && data.robotId === this.playerId) ? "Your Robot" : `Opponent (${data.robotId.substring(0,4)}...)`;
                if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Code Error (${robotIdentifier}): ${data.message}`, 'error');
                const logMessage = `--- CODE ERROR ---\n${data.message}\n------------------`;
                // Use playerId for comparison
                if (this.playerId && data.robotId === this.playerId) {
                    if (typeof window.addRobotLogMessage === 'function') window.addRobotLogMessage(logMessage);
                } else {
                    if (typeof window.addOpponentLogMessage === 'function') window.addOpponentLogMessage(logMessage);
                }
                // Use playerId for comparison - Alert only if it's the player's own error
                if (this.playerId && data.robotId === this.playerId && !this.isSpectating) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     if (typeof controls?.setState === 'function') controls.setState('lobby');
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Code error detected. Please fix and Ready Up or Test again.');
                 }
            });

             this.socket.on('gameError', (data) => {
                 console.error("Received critical game error from server:", data);
                 alert(`A critical error occurred in the game: ${data.message || 'Unknown error.'}\nThe game may have ended.`);
                 if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`SERVER GAME ERROR: ${data.message || 'Unknown error.'}`, 'error');
                 if (!this.isSpectating && typeof controls?.setState === 'function') controls.setState('lobby');
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Error Occurred. Ready Up or Test again.');
                 if (this.game) this.game.stop();
             });

            this.socket.on('connect_error', (err) => {
                console.error("Connection Error:", err.message, err);
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`Connection Failed: ${err.message}`);
                 if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`Connection Error: ${err.message}. Retrying...`, 'error');
                 if (typeof controls?.setState === 'function') controls.setState('lobby');
            });

            this.socket.on('reconnect_failed', () => {
                 console.error('Reconnection failed after multiple attempts.');
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Connection Failed Permanently. Please refresh.');
                 if (typeof window.addEventLogMessage === 'function') window.addEventLogMessage('Could not reconnect to the server. Please refresh the page.', 'error');
                 alert('Failed to reconnect to the server. Please refresh the page.');
             });

            this.socket.on('lobbyEvent', (data) => {
                if (data?.message && typeof window.addEventLogMessage === 'function') window.addEventLogMessage(data.message, data.type || 'event');
            });

            this.socket.on('lobbyStatusUpdate', (data) => {
                 const isIdle = typeof controls !== 'undefined' && (controls.uiState === 'lobby' || controls.uiState === 'waiting');
                if (isIdle && data && typeof window.updateLobbyStatus === 'function') {
                    let statusText = `Waiting: ${data.waiting !== undefined ? data.waiting : 'N/A'}`;
                    if (data.ready !== undefined) statusText += ` / Ready: ${data.ready}/2`;
                     window.updateLobbyStatus(statusText);
                }
            });

            this.socket.on('chatUpdate', (data) => {
                if (data?.sender && data.text && typeof window.addEventLogMessage === 'function') window.addEventLogMessage(`${data.sender}: ${data.text}`, 'chat');
            });

            this.socket.on('gameHistoryUpdate', (historyData) => {
                if (typeof window.updateGameHistory === 'function') window.updateGameHistory(historyData);
                else console.warn("updateGameHistory function not found!");
            });
            
            // Handle leaderboard updates
            this.socket.on('leaderboardUpdate', () => {
                fetchLeaderboardData();
            });


        } catch (error) {
             console.error("Error initializing Socket.IO connection:", error);
             if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Network Initialization Error');
             alert("Failed to initialize network connection. Check console for details.");
        }
    } // End connect()


    /**
     * Sends the player's complete loadout data (visuals, name, code) to the server.
     * Called by the Controls class when the 'Ready Up' button is clicked.
     * @param {object} loadoutData - The prepared loadout data object.
     *                               Expected: { name: string, visuals: object, code: string }
     */
    sendLoadoutData(loadoutData) { // Renamed and updated parameter
        const canSend = typeof controls !== 'undefined' && controls.uiState === 'lobby';
        if (!canSend) {
             console.warn("Network: Attempted to send player data while not in 'lobby' state. Ignoring.");
             if(typeof window.addEventLogMessage === 'function') window.addEventLogMessage("Cannot ready up now.", "error");
             return;
        }
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send player data.");
             alert("Not connected to server. Please check connection and try again.");
             return;
        }

        // Validate the structure minimally before sending
        if (!loadoutData || !loadoutData.name || !loadoutData.visuals || typeof loadoutData.code !== 'string') {
             console.error("Network: Invalid loadoutData structure provided to sendLoadoutData:", loadoutData);
             alert("Internal Error: Invalid loadout data prepared.");
             return;
        }

        console.log(`Sending player loadout data to server: Name='${loadoutData.name}', Visuals=... Code=...`);
        // Emit the 'submitPlayerData' event with the new structure
        this.socket.emit('submitPlayerData', loadoutData); // Send the whole object
    }

    /**
     * Sends a signal to the server indicating the player is no longer ready.
     * Called by the Controls class when the 'Unready' button is clicked.
     */
    sendUnreadySignal() {
         const canSend = typeof controls !== 'undefined' && controls.uiState === 'waiting';
         if (!canSend) {
             console.warn("Network: Attempted to send unready signal while not in 'waiting' state. Ignoring.");
             if(typeof window.addEventLogMessage === 'function') window.addEventLogMessage("Cannot unready now.", "error");
             return;
         }
        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send unready signal.");
            if(typeof window.addEventLogMessage === 'function') window.addEventLogMessage("Cannot unready: Not connected.", "error");
            return;
        }
        console.log("Sending 'playerUnready' signal to server.");
        this.socket.emit('playerUnready');
    }

    /**
     * Sends a chat message to the server.
     * @param {string} text - The chat message text.
     */
    sendChatMessage(text) {
        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send chat message.");
            if(typeof window.addEventLogMessage === 'function') window.addEventLogMessage("Cannot send chat: Not connected.", "error");
            return;
        }
        const trimmedText = text.trim();
        if (trimmedText) {
            this.socket.emit('chatMessage', { text: trimmedText });
        }
    }

    /**
     * Sends a request to the server to start a single-player test game using the provided loadout.
     * Called by the Controls class when the 'Test Code' button is clicked.
     * @param {object} loadoutData - The prepared loadout data object for testing.
     *                               Expected: { name: string, visuals: object, code: string }
     */
    requestTestGame(loadoutData) { // Updated parameter
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot request test game.");
             alert("Not connected to server. Please check connection and try again.");
             return;
        }
         if (typeof controls === 'undefined' || controls.uiState !== 'lobby') {
             console.warn("Network: Attempted to request test game while not in lobby state. Ignored.");
             return;
         }

         // Validate the structure minimally before sending
        if (!loadoutData || !loadoutData.name || !loadoutData.visuals || typeof loadoutData.code !== 'string') {
             console.error("Network: Invalid loadoutData structure provided to requestTestGame:", loadoutData);
             alert("Internal Error: Invalid loadout data prepared for test game.");
             return;
        }

        console.log(`Sending test game request to server: Name='${loadoutData.name}', Visuals=..., Code=...`);
        // Emit the 'requestTestGame' event with the new structure
        this.socket.emit('requestTestGame', loadoutData); // Send the whole object
    }

    /**
     * Sends a signal to the server for the player's robot to self-destruct.
     */
    sendSelfDestructSignal() {
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send self-destruct signal.");
             alert("Not connected to server.");
             return;
        }
        console.log("Client sending selfDestruct event.");
        this.socket.emit('selfDestruct');
    }

} // End Network Class

// Expose class to window global scope
window.Network = Network;

/**
 * Fetches leaderboard data from the server and updates the UI.
 * Called when a game ends and periodically to refresh leaderboard data.
 */
function fetchLeaderboardData() {
    fetch('/api/leaderboard')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (typeof window.leaderboard?.updateAllLeaderboards === 'function') {
                window.leaderboard.updateAllLeaderboards(data);
            }
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
        });
}

// Set up periodic leaderboard refresh (every 2 minutes)
setInterval(fetchLeaderboardData, 120000);