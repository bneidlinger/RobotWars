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
            // Ensure Render environment variable is used if available, otherwise fallback
            // const serverUrl = process.env.RENDER_EXTERNAL_URL || undefined; // Use Render URL if deployed
            // this.socket = io(serverUrl); // Connect to specific URL if needed
            this.socket = io(); // Connects to the server that served the page by default

            // --- Socket.IO Event Listeners ---

            // On successful connection
            this.socket.on('connect', () => {
                console.log('Successfully connected to server with Socket ID:', this.socket.id);
                // Notify UI about connection status (Example for Lobby Status)
                if (typeof updateLobbyStatus === 'function') { // Check if lobby function exists
                    updateLobbyStatus('Connected. Enter name & code, then Ready Up!');
                }
            });

            // On disconnection from the server
            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
                if (this.game) {
                    this.game.stop(); // Stop rendering if disconnected
                }
                // Update UI
                 if (typeof updateLobbyStatus === 'function') {
                     updateLobbyStatus(`Disconnected: ${reason}`);
                 }
                alert("Disconnected from server: " + reason);
                // Attempt to reset UI state via game or controls if possible
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
                 // Clear lobby status/log or indicate game start
                 if (typeof updateLobbyStatus === 'function') updateLobbyStatus('Game in progress...');
                 // if (typeof clearEventLog === 'function') clearEventLog(); // Optional: clear log on game start
             });

            // Server signals that the game has ended
             this.socket.on('gameOver', (data) => {
                 if (this.game && typeof this.game.handleGameOver === 'function') {
                     this.game.handleGameOver(data);
                 }
                 // Update lobby status after game over
                 if (typeof updateLobbyStatus === 'function') updateLobbyStatus('Game Over. Ready Up for another match!');
             });

            // Server reports an error in the robot's code (compilation or runtime)
            this.socket.on('codeError', (data) => {
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                // Display error to the user, perhaps only if it's their robot
                if (data.robotId === this.playerId) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and fix your code.`);
                     // Re-enable controls after a code error so they can fix and resubmit
                     const runButton = document.getElementById('btn-run');
                     const appearanceSelect = document.getElementById('robot-appearance-select');
                     const playerNameInput = document.getElementById('playerName');
                     if (runButton) { runButton.textContent = "Run Simulation"; runButton.disabled = false; }
                     if (appearanceSelect) { appearanceSelect.disabled = false; }
                     if (playerNameInput) { playerNameInput.disabled = false; }
                     if (typeof updateLobbyStatus === 'function') updateLobbyStatus('Code error detected. Please fix and Ready Up again.');
                 }
            });

            // Handle connection errors (e.g., server is down)
            this.socket.on('connect_error', (err) => {
                console.error("Connection Error:", err.message, err);
                 if (typeof updateLobbyStatus === 'function') {
                     updateLobbyStatus(`Connection Failed: ${err.message}`);
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

            // --- Lobby/Chat Event Listeners (Placeholders) ---
            this.socket.on('lobbyEvent', (data) => {
                if (data && data.message && typeof addEventLogMessage === 'function') {
                    addEventLogMessage(data.message, 'event'); // Pass type 'event'
                }
            });

            this.socket.on('lobbyStatusUpdate', (data) => {
                if (data && typeof updateLobbyStatus === 'function') {
                    // Example: updateLobbyStatus(`Waiting: ${data.waiting} / Ready: ${data.ready}`);
                    // We'll refine the status text later based on data structure
                    let statusText = `Waiting: ${data.waiting || 0}`;
                    if (data.ready !== undefined) {
                        statusText += ` / Ready: ${data.ready}`;
                    }
                     updateLobbyStatus(statusText);
                }
            });

            this.socket.on('chatUpdate', (data) => {
                if (data && data.sender && data.text && typeof addEventLogMessage === 'function') {
                    // Format chat message differently in the log
                    addEventLogMessage(`${data.sender}: ${data.text}`, 'chat'); // Pass type 'chat'
                }
            });
            // --- End Lobby/Chat Listeners ---


        } catch (error) {
             console.error("Error initializing Socket.IO connection:", error);
             if (typeof updateLobbyStatus === 'function') {
                 updateLobbyStatus('Network Initialization Error');
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
    sendCodeAndAppearance(code, appearance, name) { // <-- Added 'name' parameter
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
             name: name // <-- Include the name field
        });
    }

    /**
     * Sends a chat message to the server.
     * Called by the (upcoming) chat UI logic.
     * @param {string} text - The chat message text.
     */
    sendChatMessage(text) {
        if (!this.socket || !this.socket.connected) {
            console.error("Socket not connected. Cannot send chat message.");
            // Optionally alert user or disable chat input
            return;
        }
        const trimmedText = text.trim();
        if (trimmedText) { // Only send non-empty messages
            this.socket.emit('chatMessage', { text: trimmedText });
        }
    }

    // Placeholder for sending explicit ready/unready signals if needed later
    // sendReadySignal(isReady) {
    //     if (!this.socket || !this.socket.connected) return;
    //     this.socket.emit(isReady ? 'playerReady' : 'playerUnready');
    // }

} // End Network Class