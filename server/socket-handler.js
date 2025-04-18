// server/socket-handler.js
const GameManager = require('./game-manager');

/**
 * Initializes Socket.IO event handlers for the application.
 * Manages player connections, disconnections, data submission, readiness signals, chat,
 * and routes players to spectate if games are in progress. // <-- Added description
 * Delegates game logic to the GameManager.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 */
function initializeSocketHandler(io) {
    // Create a single instance of the GameManager to manage the application state
    const gameManager = new GameManager(io);

    // Handle new client connections
    io.on('connection', (socket) => {
        console.log(`New client connecting: ${socket.id}`);

        // --- START SPECTATOR CHECK ---
        let spectateTarget = null;
        if (gameManager.activeGames.size > 0) {
            // Simple logic: pick the first active game found
            // Use try-catch as .next().value could error if map becomes empty between check and access (unlikely but safe)
            try {
                const [gameId, gameInstance] = gameManager.activeGames.entries().next().value; // Gets [key, value] of first entry
                const gameName = gameInstance.gameName || `Game ${gameId}`; // Use gameName from instance

                spectateTarget = { gameId, gameName };
                console.log(`[Socket ${socket.id}] Active game found ('${gameName}' - ${gameId}). Routing to spectate.`);

                // 1. Assign ID immediately (needed for client state)
                socket.emit('assignId', socket.id);

                // 2. Join the specific spectator room for this game
                const spectatorRoom = `spectator-${gameId}`;
                socket.join(spectatorRoom);
                console.log(`[Socket ${socket.id}] Joined spectator room: ${spectatorRoom}`);

                // 3. Emit 'spectateStart' event to the connecting client ONLY
                socket.emit('spectateStart', {
                    gameId: gameId,
                    gameName: gameName // Send game name
                    // Future: Could include initial player list or partial state here
                });

                // 4. Notify lobby about spectator joining (optional, can be noisy)
                 io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... started spectating game '${gameName}'.` });

                // 5. DO NOT add to gameManager.pendingPlayers yet.

            } catch (error) {
                 console.error(`[Socket ${socket.id}] Error finding active game to spectate: ${error}. Adding to lobby instead.`);
                 // Fallback to normal lobby logic if error occurs
                 gameManager.addPlayer(socket);
                 socket.emit('assignId', socket.id);
                 io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });
                 gameManager.broadcastLobbyStatus();
            }

        } else {
            // --- NO ACTIVE GAMES - Proceed with Normal Lobby Logic ---
            console.log(`[Socket ${socket.id}] No active games. Adding to lobby.`);

            // Add player to the GameManager's pending list
            gameManager.addPlayer(socket);

            // Assign a unique ID to the newly connected client
            socket.emit('assignId', socket.id);

            // Notify all clients (including sender) about the new connection
            // Note: Name is not known yet, use partial ID.
            io.emit('lobbyEvent', { message: `Player ${socket.id.substring(0, 4)}... connected.` });

            // Send the current lobby status (counts) to the new client and everyone else
            gameManager.broadcastLobbyStatus();
        }
        // --- END SPECTATOR CHECK ---


        // Handle client disconnections
        socket.on('disconnect', () => {
            // Try to get player name *before* removing them from GameManager
            const playerName = gameManager.getPlayerName(socket.id) || socket.id.substring(0, 4)+'...';
            console.log(`Client disconnected: ${playerName} (${socket.id})`);

            // Check if the disconnected socket was potentially a spectator
            // Note: A robust solution would track spectators explicitly, but for now,
            // we just ensure removePlayer is called. If they weren't pending or in a game,
            // it handles it gracefully. If they were spectating, they aren't in those lists
            // anyway, so the primary effect is logging and potentially leaving rooms if needed.
            // Sockets automatically leave rooms they joined upon disconnect.

            // Remove the player from GameManager (handles pending list and active games)
            gameManager.removePlayer(socket.id);

            // Notify remaining clients about the disconnection using the retrieved name
            // Only announce disconnect if they weren't just a spectator (or handle differently?)
            // For now, always announce, gameManager.removePlayer logs type of removal.
            io.emit('lobbyEvent', { message: `Player ${playerName} disconnected.` });

            // Update lobby status counts for all remaining clients
            gameManager.broadcastLobbyStatus();
        });

        // Handle player submitting their code, appearance, and name (implicitly marks them as Ready)
        socket.on('submitPlayerData', (data) => {
            // --- Prevent spectators from submitting data ---
            // Player shouldn't be able to submit if they are in a game OR if they are not in the pending list (e.g. spectating)
            if (gameManager.playerGameMap.has(socket.id) || !gameManager.pendingPlayers.has(socket.id)) {
                console.warn(`[Socket ${socket.id}] Attempted to submit data while in game or spectating. Ignoring.`);
                socket.emit('lobbyEvent', { message: "Cannot submit data while in game or spectating.", type: "error" });
                return;
            }
            // --- End spectator check ---

            // Validate received data structure
            if (data && typeof data.code === 'string' && typeof data.appearance === 'string' && typeof data.name === 'string') {

                // Sanitize/validate name server-side (trim, length, default, basic HTML prevention)
                const name = data.name.trim();
                // Increased name length limit
                const sanitizedName = name.substring(0, 24) || `Anon_${socket.id.substring(0,4)}`;
                // Basic tag stripping instead of replacement
                const finalName = sanitizedName.replace(/<[^>]*>/g, ""); // Strip HTML tags


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
            // --- Prevent spectators from unreadying ---
             if (gameManager.playerGameMap.has(socket.id) || !gameManager.pendingPlayers.has(socket.id)) {
                 console.warn(`[Socket ${socket.id}] Attempted to unready while in game or spectating. Ignoring.`);
                 socket.emit('lobbyEvent', { message: "Cannot unready while in game or spectating.", type: "error" });
                 return;
             }
            // --- End spectator check ---

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
                     // Note: socket.rooms includes the socket's own ID room, so check size > 1
                     const rooms = Array.from(socket.rooms);
                     if (rooms.length > 1) {
                         // Check if any room starts with 'spectator-'
                         const spectatingRoom = rooms.find(room => room.startsWith('spectator-'));
                         if (spectatingRoom) {
                            senderName = `Spectator_${socket.id.substring(0,4)}`;
                            isSpectator = true;
                         }
                     }
                     // If still no name and not identified as spectator, use generic unknown label
                     if (!senderName) {
                         senderName = `Player_${socket.id.substring(0,4)}`;
                     }
                 }

                // Trim and limit message length
                const messageText = data.text.trim().substring(0, 100);

                if (messageText) { // Ensure message isn't empty after trimming
                    // Basic sanitization (prevent simple HTML/script injection)
                    const sanitizedText = messageText.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Use HTML entities

                    console.log(`[Chat] ${senderName}: ${sanitizedText}`);

                    // Broadcast the sanitized chat message to ALL connected clients
                    // Spectators can chat too.
                    io.emit('chatUpdate', {
                        sender: senderName,
                        text: sanitizedText,
                        isSpectator: isSpectator // Optional: add flag if client wants to style spectator messages
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

    }); // End io.on('connection')

    console.log("[Socket Handler] Initialized and listening for connections.");
}

module.exports = initializeSocketHandler;