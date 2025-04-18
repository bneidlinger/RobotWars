// server/socket-handler.js
const GameManager = require('./game-manager');

/**
 * Initializes Socket.IO event handlers for the application.
 * Manages player connections, disconnections, data submission, readiness signals, chat,
 * routes players to spectate if games are in progress, and sends initial game history. // <-- Added history mention
 * Delegates game logic to the GameManager.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 */
function initializeSocketHandler(io) {
    // Create a single instance of the GameManager to manage the application state
    const gameManager = new GameManager(io);

    // Handle new client connections
    io.on('connection', (socket) => {
        console.log(`New client connecting: ${socket.id}`);

        // Assign ID immediately (needed for client state & potential spectator join)
        socket.emit('assignId', socket.id);

        // --- SPECTATOR CHECK ---
        let wasSpectator = false; // Flag if routed to spectate initially
        if (gameManager.activeGames.size > 0) {
            // Simple logic: pick the first active game found
            try {
                const [gameId, gameInstance] = gameManager.activeGames.entries().next().value;
                const gameName = gameInstance.gameName || `Game ${gameId}`;
                const spectatorRoom = `spectator-${gameId}`;

                spectateTarget = { gameId, gameName };
                console.log(`[Socket ${socket.id}] Active game found ('${gameName}' - ${gameId}). Routing to spectate.`);

                // 1. Join the specific spectator room for this game
                socket.join(spectatorRoom);
                console.log(`[Socket ${socket.id}] Joined spectator room: ${spectatorRoom}`);

                // 2. Emit 'spectateStart' event to the connecting client ONLY
                socket.emit('spectateStart', { gameId: gameId, gameName: gameName });

                // 3. Notify lobby about spectator joining (optional)
                io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... started spectating game '${gameName}'.` });

                // 4. DO NOT add to gameManager.pendingPlayers yet.
                wasSpectator = true; // Mark as routed to spectate

            } catch (error) {
                 console.error(`[Socket ${socket.id}] Error finding active game to spectate: ${error}. Adding to lobby instead.`);
                 // Fallback to normal lobby logic
                 gameManager.addPlayer(socket);
                 io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });
                 gameManager.broadcastLobbyStatus(); // Broadcast status after adding to lobby
            }

        } else {
            // --- NO ACTIVE GAMES - Proceed with Normal Lobby Logic ---
            console.log(`[Socket ${socket.id}] No active games. Adding to lobby.`);
            gameManager.addPlayer(socket);
            io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });
            gameManager.broadcastLobbyStatus(); // Broadcast status after adding to lobby
        }
        // --- END SPECTATOR CHECK ---


        // --- Send Initial Game History ---
        // Send *after* potential spectator routing or lobby add
        // Convert map values to an array, sort by endTime descending (newest first)
        const currentHistory = Array.from(gameManager.recentlyCompletedGames.values())
                                  .sort((a, b) => b.endTime - a.endTime);
        if (currentHistory.length > 0) {
            console.log(`[Socket ${socket.id}] Sending initial game history (${currentHistory.length} entries).`);
            socket.emit('gameHistoryUpdate', currentHistory); // Send only to new client
        }
        // --- End Initial History Send ---


        // Handle client disconnections
        socket.on('disconnect', () => {
            // Try to get player name *before* removing them from GameManager
            const playerName = gameManager.getPlayerName(socket.id) || socket.id.substring(0, 4)+'...';
            console.log(`Client disconnected: ${playerName} (${socket.id})`);

            // Remove the player from GameManager (handles pending, active games, playerGameMap)
            gameManager.removePlayer(socket.id);

            // Notify remaining clients about the disconnection using the retrieved name
            io.emit('lobbyEvent', { message: `Player ${playerName} disconnected.` });

            // Update lobby status counts for all remaining clients
            gameManager.broadcastLobbyStatus();
        });

        // Handle player submitting their code, appearance, and name (implicitly marks them as Ready)
        socket.on('submitPlayerData', (data) => {
            // --- Check if player is allowed to submit (must be in pendingPlayers) ---
            if (!gameManager.pendingPlayers.has(socket.id)) {
                const state = gameManager.playerGameMap.has(socket.id) ? 'in game' : 'spectating or unknown';
                console.warn(`[Socket ${socket.id}] Attempted to submit data while ${state}. Ignoring.`);
                socket.emit('lobbyEvent', { message: `Cannot submit data while ${state}.`, type: "error" });
                return;
            }
            // --- End check ---

            // Validate received data structure
            if (data && typeof data.code === 'string' && typeof data.appearance === 'string' && typeof data.name === 'string') {

                // Sanitize/validate name server-side
                const name = data.name.trim();
                const sanitizedName = name.substring(0, 24) || `Anon_${socket.id.substring(0,4)}`;
                const finalName = sanitizedName.replace(/<[^>]*>/g, ""); // Strip HTML tags

                console.log(`[Socket ${socket.id}] Received Player Data: Name='${finalName}', Appearance='${data.appearance}'`);

                // Pass validated data to GameManager to update player state and try matchmaking
                // GameManager will broadcast lobby status after trying to start a match.
                gameManager.handlePlayerCode(socket.id, data.code, data.appearance, finalName);

            } else {
                console.warn(`[Socket ${socket.id}] Received invalid playerData format:`, data);
                socket.emit('submissionError', { message: 'Invalid data format received by server.' });
            }
        });

        // Handle player explicitly marking themselves as "Not Ready"
        socket.on('playerUnready', () => {
            // --- Check if player is allowed to unready (must be in pendingPlayers) ---
             if (!gameManager.pendingPlayers.has(socket.id)) {
                 const state = gameManager.playerGameMap.has(socket.id) ? 'in game' : 'spectating or unknown';
                 console.warn(`[Socket ${socket.id}] Attempted to unready while ${state}. Ignoring.`);
                 socket.emit('lobbyEvent', { message: `Cannot unready while ${state}.`, type: "error" });
                 return;
             }
            // --- End check ---

            console.log(`[Socket ${socket.id}] Received 'playerUnready' signal.`);
            // Update player status in GameManager (will also broadcast status update)
            gameManager.setPlayerReadyStatus(socket.id, false);
        });

        // Handle incoming chat messages from a client
        socket.on('chatMessage', (data) => {
            if (data && typeof data.text === 'string') {
                // Get sender's current name from GameManager OR identify as spectator
                 let senderName = gameManager.getPlayerName(socket.id);
                 let isSpectator = false; // Flag to check if sender is likely a spectator

                 if (!senderName) {
                     // Check if they might be spectating by checking rooms they are in
                     const rooms = Array.from(socket.rooms);
                     if (rooms.length > 1) {
                         const spectatingRoom = rooms.find(room => room.startsWith('spectator-'));
                         if (spectatingRoom) {
                            senderName = `Spectator_${socket.id.substring(0,4)}`;
                            isSpectator = true;
                         }
                     }
                     if (!senderName) { senderName = `Player_${socket.id.substring(0,4)}`; } // Fallback
                 }

                // Trim and limit message length
                const messageText = data.text.trim().substring(0, 100);

                if (messageText) { // Ensure message isn't empty after trimming
                    // Basic sanitization
                    const sanitizedText = messageText.replace(/</g, "<").replace(/>/g, ">"); // Use HTML entities

                    console.log(`[Chat] ${senderName}: ${sanitizedText}`);

                    // Broadcast the sanitized chat message to ALL connected clients
                    io.emit('chatUpdate', {
                        sender: senderName,
                        text: sanitizedText,
                        isSpectator: isSpectator
                    });
                }
            } else {
                 console.warn(`[Socket ${socket.id}] Received invalid chat message format:`, data);
            }
        });

        // Listener for player actions during a game (currently unused placeholder)
        // socket.on('robotAction', (action) => {
        //     gameManager.handlePlayerAction(socket.id, action);
        // });

    }); // End io.on('connection')

    console.log("[Socket Handler] Initialized and listening for connections.");
}

module.exports = initializeSocketHandler;