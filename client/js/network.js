// client/js/network.js

/**
 * Handles client-side network communication with the server using Socket.IO.
 * Connects to the server, sends player data (including name),
 * receives game state updates, and handles lobby/chat events.
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
            this.socket = io(); // Connects to the server that served the page by default

            // --- Socket.IO Event Listeners ---

            // On successful connection
            this.socket.on('connect', () => {
                console.log('Successfully connected to server with Socket ID:', this.socket.id);
                // Notify UI about connection status
                if (typeof window.updateLobbyStatus === 'function') {
                    window.updateLobbyStatus('Connected. Enter name & code, then Ready Up!');
                }
                 // Clear log on connect and add welcome message
                 if (typeof window.clearEventLog === 'function') window.clearEventLog();
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage("Welcome! Connect to chat and wait for players...", "info");
                 }
            });

            // On disconnection from the server
            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
                if (this.game) {
                    this.game.stop(); // Stop rendering if disconnected
                }
                // Update UI
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Disconnected: ${reason}`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Disconnected from server: ${reason}`, 'error');
                 }
                alert("Disconnected from server: " + reason);
                // Attempt to reset UI state
                const runButton = document.getElementById('btn-run');
                const appearanceSelect = document.getElementById('robot-appearance-select');
                const playerNameInput = document.getElementById('playerName');
                if (runButton) { runButton.textContent = "Run Simulation"; runButton.disabled = false; }
                if (appearanceSelect) { appearanceSelect.disabled = false; }
                if (playerNameInput) { playerNameInput.disabled = false; }
            });

            // Server assigns a unique ID to this client
            this.socket.on('assignId', (id) => {
                console.log('Server assigned Player ID:', id);
                this.playerId = id;
                if (this.game && typeof this.game.setPlayerId === 'function') {
                    this.game.setPlayerId(id);
                }
            });

            // Receives game state updates from the server during the match
            this.socket.on('gameStateUpdate', (gameState) => {
                if (this.game && typeof this.game.updateFromServer === 'function') {
                     this.game.updateFromServer(gameState);
                }
            });

            // Server signals that the game is starting
            this.socket.on('gameStart', (data) => {
                 if (this.game && typeof this.game.handleGameStart === 'function') {
                     this.game.handleGameStart(data);
                 }
                 // Update lobby status
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game in progress...');
                 // Optional: clear log on game start
                 // if (typeof window.clearEventLog === 'function') window.clearEventLog();
             });

            // Server signals that the game has ended
             this.socket.on('gameOver', (data) => {
                 if (this.game && typeof this.game.handleGameOver === 'function') {
                     this.game.handleGameOver(data);
                 }
                 // Update lobby status after game over
                 if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Game Over. Ready Up for another match!');
             });

            // Server reports an error in the robot's code (compilation or runtime)
            this.socket.on('codeError', (data) => {
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                // Add error to event log
                if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Code Error (Robot ${data.robotId.substring(0,4)}...): ${data.message}`, 'error');
                }
                // Display error to the user if it's their robot
                if (data.robotId === this.playerId) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     // Re-enable controls after a code error so they can fix and resubmit
                     const runButton = document.getElementById('btn-run');
                     const appearanceSelect = document.getElementById('robot-appearance-select');
                     const playerNameInput = document.getElementById('playerName');
                     if (runButton) { runButton.textContent = "Run Simulation"; runButton.disabled = false; }
                     if (appearanceSelect) { appearanceSelect.disabled = false; }
                     if (playerNameInput) { playerNameInput.disabled = false; }
                     if (typeof window.updateLobbyStatus === 'function') window.updateLobbyStatus('Code error detected. Please fix and Ready Up again.');
                 }
            });

            // Handle connection errors (e.g., server is down)
            this.socket.on('connect_error', (err) => {
                console.error("Connection Error:", err.message, err);
                 if (typeof window.updateLobbyStatus === 'function') {
                     window.updateLobbyStatus(`Connection Failed: ${err.message}`);
                 }
                 if (typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(`Connection Error: ${err.message}`, 'error');
                 }
                alert("Failed to connect to the game server. Please ensure it's running and refresh the page.");
                // Reset UI elements if connection fails initially
                 const runButton = document.getElementById('btn-run');
                 const appearanceSelect = document.getElementById('robot-appearance-select');
                 const playerNameInput = document.getElementById('playerName');
                 if (runButton) { runButton.textContent = "Run Simulation"; runButton.disabled = false; }
                 if (appearanceSelect) { appearanceSelect.disabled = false; }
                 if (playerNameInput) { playerNameInput.disabled = false; }
            });


            // --- Lobby/Chat Event Listeners ---
            this.socket.on('lobbyEvent', (data) => {
                // Check if the global function exists before calling
                if (data && data.message && typeof window.addEventLogMessage === 'function') {
                    window.addEventLogMessage(data.message, 'event'); // Use 'event' type styling
                }
            });

            this.socket.on('lobbyStatusUpdate', (data) => {
                // Check if the global function exists before calling
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
     * Called by the Controls class when the 'Run/Ready' button is clicked.
     * @param {string} code - The robot AI code written by the player.
     * @param {string} appearance - The identifier for the chosen robot appearance.
     * @param {string} name - The player's chosen name.
     */
    sendCodeAndAppearance(code, appearance, name) {
        // Ensure the socket exists and is connected before attempting to send
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send player data.");
             alert("Not connected to server. Please check connection and try again.");
             // Optionally try to re-enable UI if send fails
             const runButton = document.getElementById('btn-run');
             const appearanceSelect = document.getElementById('robot-appearance-select');
             const playerNameInput = document.getElementById('playerName');
             if (runButton) runButton.disabled = false;
             if (appearanceSelect) appearanceSelect.disabled = false;
             if (playerNameInput) playerNameInput.disabled = false;
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