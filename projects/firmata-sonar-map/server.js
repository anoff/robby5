const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();

const port = 3030;
const webDistPath = path.join(__dirname, 'web');

let server, io;
app.use('/', express.static(webDistPath));
app.get('/', function(req, res) {
  res.sendFile(path.join(webDistPath, 'index.html'));
});

function start() {
  server = app.listen(port, function() {
    console.log(`http://localhost:${port}`);
  });
  io = socket.listen(server);
}

module.exports = {
  update: val => io.sockets.emit('data', val),
  start
}
