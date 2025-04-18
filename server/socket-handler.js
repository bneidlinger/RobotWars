// server/socket-handler.js
const GameManager = require('./game-manager');

function initializeSocketHandler(io) {
    const gameManager = new GameManager(io);

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Add player to the pending list and assign ID
        gameManager.addPlayer(socket);
        socket.emit('assignId', socket.id);

        // Notify everyone (including sender) about the new connection (basic event)
        // We'll enhance this later with names once available
        io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });
        // Send initial lobby status update
        gameManager.broadcastLobbyStatus(); // Add this method to GameManager

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            const playerName = gameManager.getPlayerName(socket.id) || socket.id.substring(0, 4)+'...'; // Get name before removal
            gameManager.removePlayer(socket.id);
            // Notify remaining players about disconnection
            io.emit('lobbyEvent', { message: `Player ${playerName} disconnected.` });
            gameManager.broadcastLobbyStatus(); // Update lobby status after removal
        });

        // Listener for player submitting code, appearance, and name
        socket.on('submitPlayerData', (data) => {
            // Validate received data structure
            if (data && typeof data.code === 'string' && typeof data.appearance === 'string' && typeof data.name === 'string') {

                // Sanitize/validate name server-side
                const name = data.name.trim();
                const sanitizedName = name.substring(0, 16) || `Anon_${socket.id.substring(0,4)}`; // Limit length, fallback if empty after trim
                const finalName = sanitizedName.replace(/</g, "<").replace(/>/g, ">"); // Basic HTML tag prevention

                console.log(`[Socket ${socket.id}] Received Player Data: Name='${finalName}', Appearance='${data.appearance}'`);

                // Pass code, appearance, and the *sanitized* name to the game manager
                gameManager.handlePlayerCode(socket.id, data.code, data.appearance, finalName);

                // Notify lobby that player is ready (we'll refine this with explicit ready later)
                io.emit('lobbyEvent', { message: `Player ${finalName} is ready!` });
                gameManager.broadcastLobbyStatus(); // Update counts

            } else {
                console.warn(`[Socket ${socket.id}] Received invalid playerData format:`, data);
                // Optionally send an error back to the client
                socket.emit('submissionError', { message: 'Invalid data format received by server.' });
            }
        });

        // Listener for chat messages from a client
        socket.on('chatMessage', (data) => {
            if (data && typeof data.text === 'string') {
                const senderName = gameManager.getPlayerName(socket.id) || `Anon_${socket.id.substring(0,4)}`;
                const messageText = data.text.trim().substring(0, 100); // Limit message length

                if (messageText) { // Ensure message isn't empty after trimming
                    // Basic sanitization (prevent simple HTML injection)
                    const sanitizedText = messageText.replace(/</g, "<").replace(/>/g, ">");

                    console.log(`[Chat] ${senderName}: ${sanitizedText}`);

                    // Broadcast the chat message to ALL connected clients
                    io.emit('chatUpdate', {
                        sender: senderName,
                        text: sanitizedText
                    });
                }
            } else {
                 console.warn(`[Socket ${socket.id}] Received invalid chat message format:`, data);
            }
        });


        // Listener for player actions (currently unused but kept for potential future)
        // socket.on('robotAction', (action) => {
        //     gameManager.handlePlayerAction(socket.id, action);
        // });

        // Optional: Listener for explicit ready/unready signal (Phase 2 - Priority 3)
        // socket.on('playerReady', (isReady) => {
        //    gameManager.setPlayerReadyStatus(socket.id, isReady);
        // });

        // Optional: Listener for reset request (maybe used with explicit ready)
        // socket.on('playerResetRequest', () => {
        //     gameManager.handlePlayerReset(socket.id); // Needs implementation in GameManager
        // });

    }); // End io.on('connection')

    console.log("[Socket Handler] Initialized and listening for connections.");
}

module.exports = initializeSocketHandler;