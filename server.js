const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express and the HTTP server
const app = express();
const server = http.createServer(app);

// Attach Socket.io to the HTTP server
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));


app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/about.html');
});



// Listen for incoming Socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for a custom 'chat_message' event from this client
    socket.on('chat_message', (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);

        // Broadcast the message to ALL connected clients (including the sender)
        io.emit('chat_message', msg);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});