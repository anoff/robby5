const five = require('johnny-five');
const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();

const port = 3030;
const webDistPath = path.join(__dirname, 'web');

app.use('/', express.static(webDistPath));
app.get('/', function(req, res) {
    res.sendFile(path.join(webDistPath, 'index.html'));
});

const board = new five.Board({/*port: '/dev/cu.usbmodem1411',*/ repl: false });
// cp2102 bridge on raspi     '/dev/ttyUSB0'

let sonar;
board.on('ready', function() {
  console.log('BOARD READY');
  
  sonar = new five.Proximity({
    controller: 'HCSR04',
    pin: 'A0'
  });

  sonar.on('data', function() {
    io.sockets.emit('cm_value', this.cm);
  });

});

const server = app.listen(port, function() {
    console.log(`http://localhost:${port}`);
});
const io = socket.listen(server);
