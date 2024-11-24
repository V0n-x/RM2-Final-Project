const http = require('http');
const { Server } = require('socket.io');

let io;

const handleChatMSG = (msg) => {
  io.emit(msg.channel, msg.message);
};

const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);

  io.on('connection', (socket) => {
    console.log('user connected!');

    socket.on('disconnect', () => {
      console.log('user disconnected!');
    });

    socketSetup.on('chat meessage', handleChatMSG);
  });

  return server;
};

module.exports = socketSetup;
