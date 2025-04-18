// server/socket-handler.js
const GameManager = require('./game-manager');

function initializeSocketHandler(io) {
    const gameManager = new GameManager(io);

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);
        gameManager.addPlayer(socket);
        socket.emit('assignId', socket.id);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            gameManager.removePlayer(socket.id);
        });

        // *** Update listener name and handler ***
        socket.on('submitPlayerData', (data) => {
            // Validate data slightly
            if (data && typeof data.code === 'string' && typeof data.appearance === 'string') {
                // Pass both code and appearance to the manager
                gameManager.handlePlayerCode(socket.id, data.code, data.appearance);
            } else {
                console.warn(`Received invalid playerData from ${socket.id}:`, data);
                // Maybe send an error back to the client?
                // socket.emit('submissionError', { message: 'Invalid data format.' });
            }
        });

        socket.on('robotAction', (action) => {
            gameManager.handlePlayerAction(socket.id, action);
        });
    });
}

module.exports = initializeSocketHandler;