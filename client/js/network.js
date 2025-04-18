// client/js/network.js

/**
 * Handles client-side network communication with the server using Socket.IO.
 * Connects to the server, sends player data, and receives game state updates.
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
            this.socket = io();

            // --- Socket.IO Event Listeners ---

            // On successful connection
            this.socket.on('connect', () => {
                console.log('Successfully connected to server with Socket ID:', this.socket.id);
            });

            // On disconnection from the server
            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
                if (this.game) {
                    this.game.stop(); // Stop rendering if disconnected
                }
                alert("Disconnected from server: " + reason);
                // Attempt to reset UI state via game or controls if possible
                // This might involve finding the button directly if game ref is lost
                const runButton = document.getElementById('btn-run');
                const appearanceSelect = document.getElementById('robot-appearance-select');
                if (runButton) {
                    runButton.textContent = "Run Simulation";
                    runButton.disabled = false;
                }
                 if (appearanceSelect) {
                    appearanceSelect.disabled = false;
                }
            });

            // Server assigns a unique ID to this client
            this.socket.on('assignId', (id) => {
                console.log('Server assigned Player ID:', id);
                this.playerId = id;
                // Pass the ID to the game object if it exists and has the method
                if (this.game && typeof this.game.setPlayerId === 'function') {
                    this.game.setPlayerId(id);
                }
            });

            // Receives game state updates from the server during the match
            this.socket.on('gameStateUpdate', (gameState) => {
                // Pass the received state to the game object for processing and rendering
                if (this.game && typeof this.game.updateFromServer === 'function') {
                     this.game.updateFromServer(gameState);
                }
            });

            // Server signals that the game is starting
            this.socket.on('gameStart', (data) => {
                 if (this.game && typeof this.game.handleGameStart === 'function') {
                     this.game.handleGameStart(data);
                 }
             });

            // Server signals that the game has ended
             this.socket.on('gameOver', (data) => {
                 if (this.game && typeof this.game.handleGameOver === 'function') {
                     this.game.handleGameOver(data);
                 }
             });

            // Server reports an error in the robot's code (compilation or runtime)
            this.socket.on('codeError', (data) => {
                console.error(`Received Code Error for Robot ${data.robotId}:`, data.message);
                // Display error to the user, perhaps only if it's their robot
                if (data.robotId === this.playerId) {
                     alert(`Your Robot Code Error:\n${data.message}\n\nYou might need to reset and try again.`);
                     // Optionally re-enable UI elements after an error? Or wait for reset?
                 }
            });

            // Handle connection errors (e.g., server is down)
            this.socket.on('connect_error', (err) => {
                console.error("Connection Error:", err.message, err);
                alert("Failed to connect to the game server. Please ensure it's running and refresh the page.");
                // Reset UI elements if connection fails initially
                 const runButton = document.getElementById('btn-run');
                 const appearanceSelect = document.getElementById('robot-appearance-select');
                 if (runButton) {
                     runButton.textContent = "Run Simulation";
                     runButton.disabled = false;
                 }
                  if (appearanceSelect) {
                     appearanceSelect.disabled = false;
                 }
            });

        } catch (error) {
             console.error("Error initializing Socket.IO connection:", error);
             alert("Failed to initialize network connection. Check console for details.");
        }
    } // End connect()

    /**
     * Sends the player's robot code and chosen appearance to the server.
     * Called by the Controls class when the 'Run Simulation' button is clicked.
     * @param {string} code - The robot AI code written by the player.
     * @param {string} appearance - The identifier for the chosen robot appearance.
     */
    sendCodeAndAppearance(code, appearance) {
        // Ensure the socket exists and is connected before attempting to send
        if (!this.socket || !this.socket.connected) {
             console.error("Socket not available or not connected. Cannot send player data.");
             alert("Not connected to server. Please check connection and try again.");
             // Optionally try to re-enable UI if send fails
             const runButton = document.getElementById('btn-run');
             const appearanceSelect = document.getElementById('robot-appearance-select');
             if (runButton) runButton.disabled = false;
             if (appearanceSelect) appearanceSelect.disabled = false;
             return;
        }

        console.log(`Sending player data to server: { appearance: '${appearance}', code: ... }`);
        // Emit a 'submitPlayerData' event with an object containing both pieces of data
        this.socket.emit('submitPlayerData', {
             code: code,
             appearance: appearance
        });
    }

    /**
     * Placeholder for sending specific robot actions (e.g., for client-prediction models).
     * Currently not used as the interpreter runs fully on the server.
     * @param {object} action - The action object (e.g., { type: 'drive', direction: 90, speed: 3 }).
     */
    // sendRobotAction(action) {
    //      if (!this.socket || !this.socket.connected) return console.error("Socket not connected.");
    //     action.playerId = this.playerId; // Tag action with player ID
    //     this.socket.emit('robotAction', action);
    // }

} // End Network Class