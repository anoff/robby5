const firmata = require('firmata');
const serverStart = require('./server');

const SERVO_PIN = 3;
const POS_MAX = 170;
const POS_MIN = 0.01; // 0 won't update the chart
const POS_START = 90;

// start the johnny-five connection
const board = new firmata.Board('/dev/tty.usbmodem1411', err => {
    err && console.error(err);
});

function moveServo(pos) {
  board.servoWrite(SERVO_PIN, pos);
}
board.on('ready', function(err) {
  console.log('BOARD READY');
  board.servoConfig(SERVO_PIN, POS_MIN, POS_MAX);
  moveServo(POS_START);
});

serverStart(moveServo);
