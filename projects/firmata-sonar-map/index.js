const Board = require('firmata');

function absAnalogPin(board, analogPin) {
  if (!board) {
    throw new Error('should be used in context of a valid firmata board');
  }
  const id = parseInt(analogPin.slice(1));
  return board.analogPins[id];
}

const PIN = 'A0';
const board = new Board('/dev/cu.usbmodem1411', () => {
  console.log('BOARD READY');
  const pin = absAnalogPin(board, PIN);
  //board.pinMode(pin, board.MODES.DIGITAL);
  console.log(pin)
  board.pingRead({
    pin,
    value: board.HIGH,
    pulseOut: 5
  }, (microseconds) => {
    console.log(`response: ${microseconds} µs -> ${microseconds / 29.1 / 2} cm`);
  });

  board.on('ping-read-' + pin, dist => {
    console.log('internal ping response: ' + dist);
  });
});
