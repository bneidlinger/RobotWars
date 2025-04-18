// client/js/network.js

/**
 * Handles client-side network communication with the server using Socket.IO.
 * Connects to the server, sends player data (including name), readiness signals,
 * receives game state updates, handles spectating, and processes lobby/chat events. // <-- Updated description
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

                // Notify UI about connection status - Lobby/Spectate status will be updated by subsequent events
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus('Connected. Waiting for server info...');
                 }
                 // Clear log on connect and add welcome message (only if not previously connected?)
                 // This might clear logs during a temporary disconnect, maybe conditionalize
                 // if (typeof window.clearEventLog === 'function') window.clearEventLog();
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage("--> Connected to server.", "event");
                 }
                 // Client will send name/code again if they were ready before disconnect
                 // Server side handles adding back to pending if needed
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

                // Reset client ready state if disconnected unexpectedly
                if (typeof controls !== 'undefined') {
                    // Use setSpectatingState(false) which internally calls setReadyState(false)
                    if (typeof controls.setSpectatingState === 'function') {
                        controls.setSpectatingState(false);
                    } else if (typeof controls.setReadyState === 'function'){
                         controls.setReadyState(false); // Fallback
                    }
                }

                // Update UI
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Disconnected: ${reason}. Reconnecting...`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Disconnected: ${reason}. Attempting to reconnect...`, 'error');
                 }
                 // Don't use alert here as it blocks reconnection attempts
                 // alert("Disconnected from server: " + reason);
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
                     // Check if the user is already in the lobby state visually
                      const readyButton = document.getElementById('btn-ready');
                      if (readyButton && !readyButton.disabled && readyButton.textContent.includes('Ready Up')) {
                         window.updateLobbyStatus('Enter name & code, then Ready Up!');
                      }
                 }
            });

             // --- START Spectator Event Handlers ---
            this.socket.on('spectateStart', (data) => {
                console.log('Received spectateStart:', data);
                if (this.game && typeof this.game.handleSpectateStart === 'function') {
                    this.isSpectating = true;
                    this.spectatingGameId = data.gameId;
                    this.spectatingGameName = data.gameName || data.gameId; // Store name
                    this.game.handleSpectateStart(data); // Pass game info to game handler
                    if (typeof window.addEventLogMessage === 'function') {
                        window.addEventLogMessage(`Started spectating game: ${this.spectatingGameName}`, 'event');
                    }
                } else {
                    console.error("Game object or handleSpectateStart method not available!");
                }
            });

            this.socket.on('spectateGameOver', (data) => {
                console.log('Received spectateGameOver:', data);
                 // Check if we are actually spectating the game that ended
                 // Match using gameId received in the event data
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
                     // Reset spectator state regardless of game handler success
                     this.isSpectating = false;
                     this.spectatingGameId = null;
                     this.spectatingGameName = null;
                 } else {
                    console.log("Received spectateGameOver for a game we weren't spectating (or already stopped). Ignoring.");
                 }
            });
            // --- END Spectator Event Handlers ---

            // Receives game state updates from the server during the match OR while spectating
            this.socket.on('gameStateUpdate', (gameState) => {
                // Update game state whether playing or spectating
                if (this.game && typeof this.game.updateFromServer === 'function') {
                     // Only process if it's for the game we are in or spectating
                     const currentGameId = this.isSpectating ? this.spectatingGameId : this.game.gameId;
                     if (currentGameId && currentGameId === gameState.gameId) {
                        this.game.updateFromServer(gameState);
                     } else {
                         // console.log(`Received gameStateUpdate for irrelevant game ${gameState.gameId}`); // Can be noisy
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
                     this.game.handleGameStart(data); // This will update gameId and gameName
                 }
                 // Update lobby status - Game class handleGameStart should update button text now
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus(`Playing Game: ${data.gameName || data.gameId}`);
                 if (typeof window.addEventLogMessage === 'function') {
                     window.addEventLogMessage(`Your game '${data.gameName || data.gameId}' is starting!`, 'event');
                 }
             });

            // Server signals that the game has ended (for players)
             this.socket.on('gameOver', (data) => {
                 // Ignore if spectating
                 if (this.isSpectating) {
                     console.log("Received gameOver while spectating, ignoring (should get spectateGameOver).");
                     return;
                 }

                 // Check if this gameOver matches the game we *think* we are playing
                 // Necessary if game ends very quickly or messages arrive out of order
                 if (this.game && this.game.gameId === data.gameId) {
                     // Game class handleGameOver should reset UI state, including ready state
                     if (typeof this.game.handleGameOver === 'function') {
                         this.game.handleGameOver(data);
                     }
                     // Update lobby status after game over
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Over. Ready Up for another match!');
                      if (typeof window.addEventLogMessage === 'function') {
                         // Use gameName from the game object if available
                         const endedGameName = this.game.gameName || data.gameId;
                         window.addEventLogMessage(`Your game '${endedGameName}' finished! Winner: ${data.winnerName || 'None'}`, 'event');
                     }
                 } else {
                      console.warn(`Received gameOver for game ${data.gameId}, but currently in game ${this.game ? this.game.gameId : 'None'}. Ignoring.`);
                 }
             });

            // Server reports an error in the robot's code (compilation or runtime)
            this.socket.on('codeError', (data) => {
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                // Add error to event log
                if (typeof window.addEventLogMessage === 'function') {
                    const robotIdentifier = (data.robotId === this.playerId) ? "Your Robot" : `Robot ${data.robotId.substring(0,4)}...`;
                    window.addEventLogMessage(`Code Error (${robotIdentifier}): ${data.message}`, 'error');
                }
                // Display error to the user if it's their robot
                if (data.robotId === this.playerId) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     // Re-enable controls after a code error so they can fix and resubmit
                     // Use the controls helper function if possible
                     if (typeof controls !== 'undefined' && typeof controls.setPlayingState === 'function') {
                         // Set playing state to false, which resets UI to ready state
                         controls.setPlayingState(false);
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
                  // Assume game is over, reset UI state if not already spectating
                 if (!this.isSpectating && typeof controls !== 'undefined' && typeof controls.setPlayingState === 'function') {
                     controls.setPlayingState(false); // Reset to lobby state
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
                // Avoid alert, let reconnection logic handle UI updates.
                // Reset UI elements if connection fails initially
                if (typeof controls !== 'undefined' && typeof controls.setSpectatingState === 'function') {
                     controls.setSpectatingState(false); // Resets to lobby state
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


            // --- Lobby/Chat Event Listeners (remain mostly the same) ---
            this.socket.on('lobbyEvent', (data) => {
                // Check if the global function exists before calling
                if (data && data.message && typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(data.message, data.type || 'event'); // Use type if provided by server
                }
            });

            this.socket.on('lobbyStatusUpdate', (data) => {
                // Check if the global function exists before calling
                // Do not update lobby status if spectating or playing (game.js handles those status texts)
                if (this.isSpectating || (this.game && this.game.running && !this.isSpectating)) return;

                if (data && typeof window.updateLobbyStatus === 'function') {
                    let statusText = `Waiting: ${data.waiting !== undefined ? data.waiting : 'N/A'}`;
                    if (data.ready !== undefined) {
                        // Display ready count relative to required players (assuming 2)
                        statusText += ` / Ready: ${data.ready}/2`;
                    }
                     window.updateLobbyStatus(statusText); // Update the status display
                }
            });

            this.socket.on('chatUpdate', (data) => {
                // Check if the global function exists before calling
                if (data && data.sender && data.text && typeof window.addEventLogMessage === 'function') {
                    // Format chat message differently in the log
                    window.addEventLogMessage(`${data.sender}: ${data.text}`, 'chat'); // Use 'chat' type styling
                    // Optionally use data.isSpectator for styling later
                }
            });
            // --- End Lobby/Chat Listeners ---


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
     * The server handles setting the player's ready state upon receiving this.
     * @param {string} code - The robot AI code written by the player.
     * @param {string} appearance - The identifier for the chosen robot appearance.
     * @param {string} name - The player's chosen name.
     */
    sendCodeAndAppearance(code, appearance, name) {
        // Prevent sending if spectating or playing
        if (this.isSpectating || (this.game && this.game.running && !this.isSpectating)) {
             console.warn("Attempted to send player data while spectating or playing. Ignoring.");
             if(typeof window.addEventLogMessage === 'function') {
                 window.addEventLogMessage("Cannot ready up while spectating or playing.", "error");
             }
             return;
        }

        // Ensure the socket exists and is connected before attempting to send
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send player data.");
             alert("Not connected to server. Please check connection and try again.");
             // Reset button state locally if send fails
             if (typeof controls !== 'undefined' && typeof controls.setReadyState === 'function') {
                controls.setReadyState(false);
             }
             return;
        }

        console.log(`Sending player data to server: { name: '${name}', appearance: '${appearance}', code: ... }`);
        // Emit a 'submitPlayerData' event with an object containing all data
        this.socket.emit('submitPlayerData', {
             code: code,
             appearance: appearance,
             name: name // Include the name field
        });
    }

    /**
     * Sends a signal to the server indicating the player is no longer ready.
     * Called by the Controls class when the 'Unready' button is clicked or state changes.
     */
    sendUnreadySignal() {
         // Prevent sending if spectating or playing
         if (this.isSpectating || (this.game && this.game.running && !this.isSpectating)) {
             console.warn("Attempted to send unready signal while spectating or playing. Ignoring.");
              if(typeof window.addEventLogMessage === 'function') {
                 window.addEventLogMessage("Cannot unready while spectating or playing.", "error");
             }
             return;
         }

        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send unready signal.");
            // Optionally add message to event log
            if(typeof window.addEventLogMessage === 'function') {
                window.addEventLogMessage("Cannot unready: Not connected.", "error");
            }
            return;
        }
        console.log("Sending 'playerUnready' signal to server.");
        this.socket.emit('playerUnready'); // Emit the specific event
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