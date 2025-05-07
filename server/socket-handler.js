// server/socket-handler.js
const GameManager = require('./game-manager'); // Assuming GameManager is updated

/**
 * Initializes Socket.IO event handlers.
 * Now uses session data for user identification.
 */
function initializeSocketHandler(io, db) { // db might be needed by GameManager now
    // Pass the database connection to GameManager for stats tracking
    const gameManager = new GameManager(io, db);

    io.on('connection', (socket) => {
        // Access session data associated with this socket
        const session = socket.request.session;
        let userId = session?.userId;
        let username = session?.username;

        // Only proceed if the user is logged in via session
        if (!userId || !username) {
            console.log(`[Socket ${socket.id}] Connection attempt rejected: No active session.`);
            socket.emit('authError', { message: 'Please log in to play.' });
            socket.disconnect(true);
            return;
        }

        console.log(`[Socket ${socket.id}] Client connected: User '${username}' (ID: ${userId})`);
        socket.emit('assignId', socket.id); // Still useful for client-side logic

        // --- START: Adapted Player Adding ---
        // Add player to GameManager using their user info.
        // GameManager should handle preventing duplicates or managing state if already connected.
        gameManager.addPlayer(socket); // Pass socket, GM can get user info if needed or addPlayer is adapted
        // --- END: Adapted Player Adding ---

        // --- Send Initial Game History to just this user ---
        gameManager.broadcastGameHistory(socket);


        socket.on('disconnect', () => {
            console.log(`[Socket ${socket.id}] Client disconnected: User '${username}' (ID: ${userId})`);
            // Ensure GameManager uses socket.id to remove, but might need userId too for cross-referencing
            gameManager.removePlayer(socket.id); // Pass socket.id for removal
        });

        // === Event Listeners - Use userId/username from session ===

        // Handles 'Ready Up' signal with full loadout data
        socket.on('submitPlayerData', (loadoutData) => {
             if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });

             // Validate received loadoutData structure
             if (!loadoutData || typeof loadoutData.name !== 'string' || !loadoutData.visuals || typeof loadoutData.code !== 'string') {
                 console.error(`[Socket ${socket.id}] Received invalid loadoutData structure from user ${username}:`, loadoutData);
                 socket.emit('lobbyEvent', { message: 'Invalid loadout data received. Please try again.', type: 'error' });
                 return;
             }
             // Note: Server uses the validated loadoutData.name (robot name) directly.
             // The username from session identifies the *account*.
             console.log(`[Socket ${socket.id}] User ${username} submitted player data (Robot: ${loadoutData.name})`);
             // Pass the full loadoutData received from client to GameManager
             gameManager.handlePlayerCode(socket.id, loadoutData); // handlePlayerCode expects the full {name, visuals, code}
        });

        // Handles 'Unready' signal
        socket.on('playerUnready', () => {
             if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });
             console.log(`[Socket ${socket.id}] User ${username} unreadied.`);
             // Pass socket.id only, GameManager uses this to find the player
             gameManager.setPlayerReadyStatus(socket.id, false);
        });

        // Handles 'Test Code' request with full loadout data
        socket.on('requestTestGame', (loadoutData) => {
            if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });

            // Validate received loadoutData structure
            if (!loadoutData || typeof loadoutData.name !== 'string' || !loadoutData.visuals || typeof loadoutData.code !== 'string') {
                 console.error(`[Socket ${socket.id}] Received invalid loadoutData structure for test game from user ${username}:`, loadoutData);
                 socket.emit('lobbyEvent', { message: 'Invalid loadout data received for test game. Please try again.', type: 'error' });
                 return;
            }
            
            // Check for bot profile selection (default to 'standard' if missing)
            const botProfile = loadoutData.botProfile || 'standard';
            
            // Validate bot profile is one of the allowed options
            const validProfiles = ['standard', 'aggressive', 'defensive', 'sniper', 'erratic', 'stationary'];
            if (!validProfiles.includes(botProfile)) {
                console.warn(`[Socket ${socket.id}] Received invalid bot profile "${botProfile}" from user ${username}, defaulting to standard`);
                loadoutData.botProfile = 'standard';
            } else {
                console.log(`[Socket ${socket.id}] User ${username} requested test game (Robot: ${loadoutData.name}) against "${loadoutData.botProfile}" bot`);
            }
            
            // Pass the socket object and the full loadoutData object received from the client
            gameManager.startTestGameForPlayer(socket, loadoutData);
        });

        // Handles Chat Messages
        socket.on('chatMessage', (data) => {
             if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });
             const senderName = username; // Use session username
             const messageText = data?.text || '';

             // Basic validation/sanitization (consider a library for robustness)
             if (typeof messageText !== 'string' || messageText.trim().length === 0 || messageText.length > 100) {
                 console.warn(`[Socket ${socket.id}] User ${username} sent invalid chat message.`);
                 return; // Ignore empty or too long messages
             }
             const sanitizedText = messageText.trim(); // Basic trim

             console.log(`[Socket ${socket.id}] Chat from ${senderName}: ${sanitizedText}`);
             io.emit('chatUpdate', { sender: senderName, text: sanitizedText });
        });

        // Handles Self-Destruct request
        socket.on('selfDestruct', () => {
             if (!userId || !username) return socket.emit('authError', { message: 'Session expired. Please log in.' });
             console.log(`[Socket ${socket.id}] User ${username} requested self-destruct.`);
             // Pass socket.id only, GameManager uses this to find the player/game
             gameManager.handleSelfDestruct(socket.id);
        });

    });

    console.log("[Socket Handler] Initialized with session support.");
}

module.exports = initializeSocketHandler;