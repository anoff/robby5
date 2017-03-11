const Board = require('firmata');


function absAnalogPin(board, analogPin) {
  if (!board) {
    throw new Error('should be used in context of a valid firmata board');
  }
  const id = parseInt(analogPin.slice(1));
  return board.analogPins[id];
}

function responseToMm(microseconds) {
  return microseconds / 2.91545 / 2;
  // µs / 10e6 µs/s * 343 m/s * 10e3 mm/m -> mm
}

function datahandler(us) {
  const mm = responseToMm(us);
  console.log(mm);
}

const PIN = 'A0';
const board = new Board('/dev/cu.usbmodem1411', () => {
  console.log('BOARD READY');
  const pin = absAnalogPin(board, PIN);

  function ping() {
    board.pingRead({
      pin,
      value: board.HIGH,
      pulseOut: 5
    }, us => { datahandler(us); setTimeout(ping, 20); });
  }
  ping();
});
