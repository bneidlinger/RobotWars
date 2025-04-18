// server/index.js
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const initializeSocketHandler = require('./socket-handler'); // We'll create this next

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'client' directory
const clientPath = path.join(__dirname, '..', 'client');
console.log(`Serving static files from: ${clientPath}`);
app.use(express.static(clientPath));

// Basic route for the root path (optional, as static middleware handles index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Initialize Socket.IO handling
initializeSocketHandler(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the game at: http://localhost:${PORT}`);
});