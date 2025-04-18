// client/js/network.js

/**
 * Handles client-side network communication with the server using Socket.IO.
 * Connects to the server, sends player data (including name), readiness signals,
 * receives game state updates, handles spectating, processes lobby/chat events,
 * receives game history updates, and handles robot log messages. // <-- Updated description
 */
class Network {
    /**
     * Creates a Network instance.
     * @param {Game} game - Reference to the main client-side game object.
     */
    constructor(game) {
        this.socket = null; // Will hold the Socket.IO socket instance
        this.playerId = null; // This client's unique ID assigned by the server
        this.game = game; // Reference to the main game object to pass updates
        // --- Spectator State ---
        this.isSpectating = false;
        this.spectatingGameId = null;
        this.spectatingGameName = null; // Store name for display
        // --- End Spectator State ---
        if (!this.game) {
            console.error("Network handler initialized without a valid game reference!");
        }
    }

    /**
     * Establishes the WebSocket connection to the server and sets up event listeners.
     */
    connect() {
        try {
            // Connect to the Socket.io server. Assumes server is on the same host/port.
            // Added reconnection options for robustness
            this.socket = io({
                 reconnectionAttempts: 5, // Try to reconnect 5 times
                 reconnectionDelay: 1000, // Start with 1 second delay
                 reconnectionDelayMax: 5000 // Max delay 5 seconds
            });

            // --- Socket.IO Event Listeners ---

            // On successful connection/reconnection
            this.socket.on('connect', () => {
                console.log('Successfully connected/reconnected to server with Socket ID:', this.socket.id);
                // Reset spectator state on fresh connect (server will tell us if we should spectate)
                this.isSpectating = false;
                this.spectatingGameId = null;
                this.spectatingGameName = null;

                // Reset Controls UI to lobby state upon successful connection
                if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                    controls.setState('lobby');
                } else {
                    console.warn("Controls object or setState not found on connect, UI might be incorrect.");
                }

                // Notify UI about connection status - Lobby/Spectate status will be updated by subsequent events
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus('Connected. Waiting for server info...');
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage("--> Connected to server.", "event");
                 }
                 // Clear robot log on new connection
                 if (typeof window.clearRobotLog === 'function') {
                     window.clearRobotLog();
                 }
            });

            // On disconnection from the server
            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
                 // Stop rendering if game or spectating was active
                if (this.game) {
                    this.game.stop();
                }
                // Reset spectator state
                this.isSpectating = false;
                this.spectatingGameId = null;
                this.spectatingGameName = null;

                // Attempt to reset controls UI state (though it might be disabled on reconnect anyway)
                 if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                     controls.setState('lobby'); // Attempt reset to lobby visually
                 }

                // Update UI
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Disconnected: ${reason}. Reconnecting...`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Disconnected: ${reason}. Attempting to reconnect...`, "error");
                 }
            });

            // Server assigns a unique ID to this client
            this.socket.on('assignId', (id) => {
                console.log('Server assigned Player ID:', id);
                this.playerId = id;
                if (this.game && typeof this.game.setPlayerId === 'function') {
                    this.game.setPlayerId(id);
                }
                 // After getting ID, if not spectating, prompt for Ready Up
                 if (!this.isSpectating && typeof window.updateLobbyStatus === 'function') {
                      // Check if UI is currently in the lobby state
                      if (typeof controls !== 'undefined' && controls.uiState === 'lobby') {
                         window.updateLobbyStatus('Enter name & code, then Ready Up!');
                      }
                 }
            });

             // --- START Spectator Event Handlers ---
            this.socket.on('spectateStart', (data) => {
                console.log('Received spectateStart:', data);
                if (this.game && typeof this.game.handleSpectateStart === 'function') {
                    this.isSpectating = true; // Set state BEFORE calling handler
                    this.spectatingGameId = data.gameId;
                    this.spectatingGameName = data.gameName || data.gameId; // Store name
                    this.game.handleSpectateStart(data); // Pass game info to game handler
                    if (typeof window.addEventLogMessage === 'function') {
                        window.addEventLogMessage(`Started spectating game: ${this.spectatingGameName}`, 'event');
                    }
                    // Clear robot log when starting spectate
                    if (typeof window.clearRobotLog === 'function') {
                         window.clearRobotLog();
                    }
                } else {
                    console.error("Game object or handleSpectateStart method not available!");
                }
            });

            this.socket.on('spectateGameOver', (data) => {
                console.log('Received spectateGameOver:', data);
                 // Check if we are actually spectating the game that ended
                if (this.isSpectating && this.spectatingGameId === data.gameId) {
                     if (this.game && typeof this.game.handleSpectateEnd === 'function') {
                         this.game.handleSpectateEnd(data); // Pass winner info etc.
                         if (typeof window.addEventLogMessage === 'function') {
                             const endedGameName = this.spectatingGameName || data.gameId; // Use stored name
                             window.addEventLogMessage(`Spectated game '${endedGameName}' over! Winner: ${data.winnerName || 'None'}`, 'event');
                         }
                     } else {
                         console.error("Game object or handleSpectateEnd method not available!");
                     }
                     // Reset spectator state AFTER calling handler
                     this.isSpectating = false;
                     this.spectatingGameId = null;
                     this.spectatingGameName = null;
                 } else {
                    console.log(`Received spectateGameOver for irrelevant game ${data.gameId}. Current spectate: ${this.spectatingGameId}. Ignoring.`);
                 }
            });
            // --- END Spectator Event Handlers ---

            // Receives game state updates from the server during the match OR while spectating
            this.socket.on('gameStateUpdate', (gameState) => {
                // Update game state whether playing or spectating
                if (this.game && typeof this.game.updateFromServer === 'function') {
                     // Determine the relevant game ID based on current state
                     const relevantGameId = this.isSpectating ? this.spectatingGameId : this.game.gameId;
                     if (relevantGameId && relevantGameId === gameState.gameId) {
                        this.game.updateFromServer(gameState);
                     } else {
                         // This can happen briefly during transitions, usually safe to ignore.
                         // console.log(`Received gameStateUpdate for irrelevant game ${gameState.gameId}`);
                     }
                }
            });

            // Server signals that the game is starting (for players)
            this.socket.on('gameStart', (data) => {
                 // Ignore if spectating
                 if (this.isSpectating) {
                     console.log("Received gameStart while spectating, ignoring.");
                     return;
                 }
                 if (this.game && typeof this.game.handleGameStart === 'function') {
                     // State check inside handler is safer if events race
                     this.game.handleGameStart(data); // This will update gameId and gameName
                 }
                 // Update lobby status - Game class handleGameStart should update button text now
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`Playing Game: ${data.gameName || data.gameId}`);
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage(`Your game '${data.gameName || data.gameId}' is starting!`, 'event');
                 }
                 // Clear robot log at game start
                 if (typeof window.clearRobotLog === 'function') {
                      window.clearRobotLog();
                 }
             });

            // Server signals that the game has ended (for players)
             this.socket.on('gameOver', (data) => {
                 // Ignore if spectating
                 if (this.isSpectating) {
                     console.log("Received gameOver while spectating, ignoring (expecting spectateGameOver).");
                     return;
                 }

                 // Check if this gameOver matches the game we *think* we are playing
                 if (this.game && this.game.gameId === data.gameId) {
                     if (typeof this.game.handleGameOver === 'function') {
                         this.game.handleGameOver(data); // This should reset controls UI state
                     }
                     // Update lobby status after game over
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Over. Ready Up for another match!');
                      if (typeof window.addEventLogMessage === 'function') {
                         const endedGameName = this.game.gameName || data.gameId;
                         window.addEventLogMessage(`Your game '${endedGameName}' finished! Winner: ${data.winnerName || 'None'}`, 'event');
                     }
                 } else {
                      console.warn(`Received gameOver for game ${data.gameId}, but current game is ${this.game ? this.game.gameId : 'None'}. Ignoring.`);
                 }
             });

            // Server reports an error in the robot's code (compilation or runtime)
            this.socket.on('codeError', (data) => {
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                const robotIdentifier = (data.robotId === this.playerId) ? "Your Robot" : `Robot ${data.robotId.substring(0,4)}...`;
                // Log to general event log
                if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Code Error (${robotIdentifier}): ${data.message}`, 'error');
                }
                // Also log to the specific robot's log if it's ours
                if (data.robotId === this.playerId && typeof window.addRobotLogMessage === 'function') {
                     window.addRobotLogMessage(`--- CODE ERROR ---`);
                     window.addRobotLogMessage(data.message);
                     window.addRobotLogMessage(`------------------`);
                }
                // Display alert and reset UI only if it's our robot AND we are not spectating
                if (data.robotId === this.playerId && !this.isSpectating) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     // Reset Controls UI to lobby state
                     if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                         controls.setState('lobby');
                     }
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Code error detected. Please fix and Ready Up again.');
                 }
            });

             // Server reports a critical game error (e.g., during tick)
             this.socket.on('gameError', (data) => {
                 console.error("Received critical game error from server:", data);
                 alert(`A critical error occurred in the game: ${data.message}\nThe game may have ended.`);
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage(`SERVER GAME ERROR: ${data.message}`, 'error');
                 }
                  // Assume game is over, reset UI state if playing (spectators handle via spectateGameOver implicitly)
                 if (!this.isSpectating && typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                     controls.setState('lobby'); // Reset to lobby state
                 }
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Error Occurred. Ready Up again.');
                  if (this.game) this.game.stop(); // Stop rendering
             });


            // Handle connection errors (e.g., server is down initially)
            this.socket.on('connect_error', (err) => {
                console.error("Connection Error:", err.message, err);
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Connection Failed: ${err.message}`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Connection Error: ${err.message}. Retrying...`, 'error');
                 }
                // Reset UI elements if connection fails initially
                 if (typeof controls !== 'undefined' && typeof controls.setState === 'function') {
                     controls.setState('lobby');
                 }
            });

            // Handle failed reconnection attempts
             this.socket.on('reconnect_failed', () => {
                 console.error('Reconnection failed after multiple attempts.');
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus('Connection Failed Permanently. Please refresh.');
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage('Could not reconnect to the server. Please refresh the page.', 'error');
                 }
                 alert('Failed to reconnect to the server. Please refresh the page.');
             });


            // --- Lobby/Chat/History Event Listeners ---
            this.socket.on('lobbyEvent', (data) => {
                if (data && data.message && typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(data.message, data.type || 'event');
                }
            });

            this.socket.on('lobbyStatusUpdate', (data) => {
                // Do not update lobby status text if playing or spectating (those modes have different status texts)
                 // Check controls state instead of game.running directly
                 const isIdle = typeof controls !== 'undefined' && (controls.uiState === 'lobby' || controls.uiState === 'waiting');

                if (isIdle && data && typeof window.updateLobbyStatus === 'function') {
                    let statusText = `Waiting: ${data.waiting !== undefined ? data.waiting : 'N/A'}`;
                    if (data.ready !== undefined) {
                        statusText += ` / Ready: ${data.ready}/2`;
                    }
                     window.updateLobbyStatus(statusText);
                }
            });

            this.socket.on('chatUpdate', (data) => {
                if (data && data.sender && data.text && typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`${data.sender}: ${data.text}`, 'chat');
                }
            });

            // --- Game History Listener ---
            this.socket.on('gameHistoryUpdate', (historyData) => {
                // console.log('Received game history update:', historyData); // Debug log
                if (typeof window.updateGameHistory === 'function') {
                    window.updateGameHistory(historyData);
                } else {
                    console.warn("updateGameHistory function not found!");
                }
            });
            // --- End Game History Listener ---

            // --- Add Robot Log Listener ---
            this.socket.on('robotLog', (data) => {
                if (data && typeof data.message === 'string') {
                    // Call the UI update function (defined in lobby.js)
                    if (typeof window.addRobotLogMessage === 'function') {
                        window.addRobotLogMessage(data.message);
                    } else {
                        console.warn("addRobotLogMessage function not found!");
                    }
                }
            });
            // --- End Robot Log Listener ---


        } catch (error) {
             console.error("Error initializing Socket.IO connection:", error);
             if (typeof window.updateLobbyStatus === 'function') {
                 window.updateLobbyStatus('Network Initialization Error');
             }
             alert("Failed to initialize network connection. Check console for details.");
        }
    } // End connect()

    /**
     * Sends the player's robot code, chosen appearance, and name to the server.
     * Called by the Controls class when the 'Ready Up' button is clicked.
     * @param {string} code - The robot AI code written by the player.
     * @param {string} appearance - The identifier for the chosen robot appearance.
     * @param {string} name - The player's chosen name.
     */
    sendCodeAndAppearance(code, appearance, name) {
        // This check relies on the controls state machine now
        // Allow if state is 'lobby'
        const canSend = typeof controls !== 'undefined' && controls.uiState === 'lobby';

        if (!canSend) {
             console.warn("Attempted to send player data while not in 'lobby' state. Ignoring.");
             if(typeof window.addEventLogMessage === 'function') {
                 window.addEventLogMessage("Cannot ready up now.", "error");
             }
             return;
        }

        // Ensure the socket exists and is connected
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send player data.");
             alert("Not connected to server. Please check connection and try again.");
             // Controls state should revert via disconnect/connect_error handlers if needed
             return;
        }

        console.log(`Sending player data to server: { name: '${name}', appearance: '${appearance}', code: ... }`);
        this.socket.emit('submitPlayerData', {
             code: code,
             appearance: appearance,
             name: name
        });
    }

    /**
     * Sends a signal to the server indicating the player is no longer ready.
     * Called by the Controls class when the 'Unready' button is clicked.
     */
    sendUnreadySignal() {
         // This check relies on the controls state machine now
         // Allow if state is 'waiting'
         const canSend = typeof controls !== 'undefined' && controls.uiState === 'waiting';

         if (!canSend) {
             console.warn("Attempted to send unready signal while not in 'waiting' state. Ignoring.");
              if(typeof window.addEventLogMessage === 'function') {
                 window.addEventLogMessage("Cannot unready now.", "error");
             }
             return;
         }

        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send unready signal.");
            if(typeof window.addEventLogMessage === 'function') {
                window.addEventLogMessage("Cannot unready: Not connected.", "error");
            }
            // Controls state should revert via disconnect/connect_error handlers if needed
            return;
        }
        console.log("Sending 'playerUnready' signal to server.");
        this.socket.emit('playerUnready');
    }


    /**
     * Sends a chat message to the server.
     * Called by the chat UI logic in lobby.js.
     * @param {string} text - The chat message text.
     */
    sendChatMessage(text) {
        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send chat message.");
            if(typeof window.addEventLogMessage === 'function') {
                window.addEventLogMessage("Cannot send chat: Not connected.", "error");
            }
            return;
        }
        const trimmedText = text.trim();
        if (trimmedText) { // Only send non-empty messages
            this.socket.emit('chatMessage', { text: trimmedText });
        }
    }

} // End Network Class

