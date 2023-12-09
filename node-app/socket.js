// socket.js
const socketIO = require('socket.io');

const setupSocketIO = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Example: Broadcasting a message to all connected clients
    socket.on('sendMessage', (message) => {
      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = setupSocketIO;
