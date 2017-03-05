const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();

const PORT = 3000;
const POS_MAX = 170;
const POS_MIN = 0.01; // 0 won't update the chart
const POS_START = 90;

module.exports = function (moveServo) {
  // start webserver
  const server = app.listen(PORT, function() {
    console.log(`server started on http://localhost:${PORT}`);
  });
  const io = socket.listen(server);

  // Make directory '/gui' public available:
  app.use(express.static(path.join(__dirname, 'web')));

  // Serve 'index.html':
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  // handle updates via socket.io
  let currValue = POS_START; // servo position
  let clientId = 0; // client counter

  // helper function to limit new values
  function updateValue(deltaValue) {
    let newValue = currValue + deltaValue;
    newValue = Math.min(newValue, POS_MAX);
    newValue = Math.max(newValue, POS_MIN);
    return newValue;
  }
  io.sockets.on('connection', function(socket) {
    // welcome new clients with the current value
    console.log(`client ${clientId} connected`);
    socket.emit('welcome', {
      'clientId': clientId,
      'value': currValue,
      'min': POS_MIN,
      'max': POS_MAX
    });
    clientId++;

    // validate & propagate value from any UI change
    socket.on('ui_change', function(data) {
      console.log(`value change received: ${data}`);
      currValue = updateValue(data);
      // move servo position
      moveServo(currValue);
      // propagate change to all UIs
      console.log(`emitting new value: ${currValue}`);
      io.sockets.emit('value', {value: currValue});
    });
  });
}
