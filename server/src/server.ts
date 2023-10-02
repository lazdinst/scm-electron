import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // <-- Import cors

const app = express();

// Use cors middleware to enable CORS
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allow GET and POST methods
    // You can add other configurations like headers, etc.
  },
});

let totalConnections = 0;

io.on('connection', (socket) => {
  totalConnections += 1;
  console.log(`New user connected. Total connections: ${totalConnections}`);

  // Broadcast total connections to all clients
  io.emit('totalConnections', totalConnections);

  // Handle JSON message from client
  socket.on('sendJson', (data) => {
    // Echo received JSON back to the sender
    socket.emit('receiveJson', data);
  });

  socket.on('disconnect', () => {
    totalConnections -= 1; // Decrease the count on disconnect
    console.log(`User disconnected. Total connections: ${totalConnections}`);

    // Broadcast total connections to all clients
    io.emit('totalConnections', totalConnections);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
