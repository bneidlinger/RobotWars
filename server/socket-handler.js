// server/socket-handler.js
const GameManager = require('./game-manager');

/**
 * Initializes Socket.IO event handlers for the application.
 * Manages player connections, disconnections, data submission, readiness signals, and chat.
 * Delegates game logic to the GameManager.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 */
function initializeSocketHandler(io) {
    // Create a single instance of the GameManager to manage the application state
    const gameManager = new GameManager(io);

    // Handle new client connections
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Add player to the GameManager's pending list
        gameManager.addPlayer(socket);

        // Assign a unique ID to the newly connected client
        socket.emit('assignId', socket.id);

        // Notify all clients (including sender) about the new connection
        // Note: Name is not known yet, use partial ID.
        io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });

        // Send the current lobby status (counts) to the new client and everyone else
        gameManager.broadcastLobbyStatus();

        // Handle client disconnections
        socket.on('disconnect', () => {
            // Try to get player name *before* removing them from GameManager
            const playerName = gameManager.getPlayerName(socket.id) || socket.id.substring(0, 4)+'...';
            console.log(`Client disconnected: ${playerName} (${socket.id})`);

            // Remove the player from GameManager (handles pending list and active games)
            gameManager.removePlayer(socket.id);

            // Notify remaining clients about the disconnection using the retrieved name
            io.emit('lobbyEvent', { message: `Player ${playerName} disconnected.` });

            // Update lobby status counts for all remaining clients
            gameManager.broadcastLobbyStatus();
        });

        // Handle player submitting their code, appearance, and name (implicitly marks them as Ready)
        socket.on('submitPlayerData', (data) => {
            // Validate received data structure
            if (data && typeof data.code === 'string' && typeof data.appearance === 'string' && typeof data.name === 'string') {

                // Sanitize/validate name server-side (trim, length, default, basic HTML prevention)
                const name = data.name.trim();
                const sanitizedName = name.substring(0, 16) || `Anon_${socket.id.substring(0,4)}`;
                const finalName = sanitizedName.replace(/</g, "<").replace(/>/g, ">");

                console.log(`[Socket ${socket.id}] Received Player Data: Name='${finalName}', Appearance='${data.appearance}'`);

                // Pass validated data to GameManager to update player state and try matchmaking
                gameManager.handlePlayerCode(socket.id, data.code, data.appearance, finalName);

                // Broadcast updated lobby status (GameManager emits "Player X is ready!" event)
                gameManager.broadcastLobbyStatus();

            } else {
                console.warn(`[Socket ${socket.id}] Received invalid playerData format:`, data);
                // Optionally send an error back to the specific client
                socket.emit('submissionError', { message: 'Invalid data format received by server.' });
            }
        });

        // Handle player explicitly marking themselves as "Not Ready"
        socket.on('playerUnready', () => {
            console.log(`[Socket ${socket.id}] Received 'playerUnready' signal.`);
            // Update player status in GameManager (will also broadcast status update)
            gameManager.setPlayerReadyStatus(socket.id, false);
        });

        // Handle incoming chat messages from a client
        socket.on('chatMessage', (data) => {
            if (data && typeof data.text === 'string') {
                // Get sender's current name from GameManager
                const senderName = gameManager.getPlayerName(socket.id) || `Anon_${socket.id.substring(0,4)}`;
                // Trim and limit message length
                const messageText = data.text.trim().substring(0, 100);

                if (messageText) { // Ensure message isn't empty after trimming
                    // Basic sanitization (prevent simple HTML/script injection)
                    const sanitizedText = messageText.replace(/</g, "<").replace(/>/g, ">");

                    console.log(`[Chat] ${senderName}: ${sanitizedText}`);

                    // Broadcast the sanitized chat message to ALL connected clients
                    io.emit('chatUpdate', {
                        sender: senderName,
                        text: sanitizedText
                    });
                }
            } else {
                 console.warn(`[Socket ${socket.id}] Received invalid chat message format:`, data);
            }
        });


        // Listener for player actions during a game (currently unused but kept for potential future)
        // socket.on('robotAction', (action) => {
        //     gameManager.handlePlayerAction(socket.id, action);
        // });

        // Optional: Listener for explicit reset request (might be used with ready system later)
        // socket.on('playerResetRequest', () => {
        //     // Could call setPlayerReadyStatus(socket.id, false) or a dedicated reset method
        //     gameManager.handlePlayerReset(socket.id);
        // });

    }); // End io.on('connection')

    console.log("[Socket Handler] Initialized and listening for connections.");
}

module.exports = initializeSocketHandler;