const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();
const raspividStream = require('raspivid-stream');
const wss = require('express-ws')(app);

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
  getSocket: () => io,
  start
}

app.ws('/video', (ws, req) => {
    console.log('Client connected');

    ws.send(JSON.stringify({
      action: 'init',
      width: '240',
      height: '180'
    }));

    var videoStream = raspividStream({
      framerate: 10,
      width: 240,
      height: 180,
      awb: 'fluorescent',
      rotation: 180
    });

    videoStream.on('data', (data) => {
        ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
    });

    ws.on('close', () => {
        console.log('Client left');
        videoStream.removeAllListeners('data');
    });
});

if (require.main === module) {
  start();
}
