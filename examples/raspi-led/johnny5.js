var five = require('johnny-five');
var Raspi = require('raspi-io');
const gpio = require('raspi-gpio');
var board = new five.Board({
  io: new Raspi()
});

board.on('ready', function() {
  var led = new five.Led('P1-13');
  led.blink();
});
