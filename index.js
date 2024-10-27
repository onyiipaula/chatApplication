const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/messages', messageRoutes);

// Create HTTP server and configure Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection (unchanged as per your request)
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('Database connection error:', err.message));

// Socket.io event handling
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.emit('receive_message', data); // Emit message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Server is running....');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`); // Fixed template string
});
