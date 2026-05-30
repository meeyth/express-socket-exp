const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Increase max buffer size to 10MB to allow file uploads
const io = new Server(server, { maxHttpBufferSize: 1e10 });

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('chat_message', (msg) => {
        // The server doesn't care if it's text or a file, it just broadcasts it
        io.emit('chat_message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});