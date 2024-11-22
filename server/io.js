const http = require('http');
const server = require('socket.io');

let io;

const handleChatMSG = (msg) => {
  io.emit(msg.channel, msg.message);
};

const socketSetup = (app) => {
  const server = http.createServer();
};
