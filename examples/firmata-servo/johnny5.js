const five = require('johnny-five');
const serverStart = require('./server');

const PORT = 3000;
const SERVO_PIN = 3;
const POS_MAX = 170;
const POS_MIN = 0.01; // 0 won't update the chart
const POS_START = 90;

// start the johnny-five connection
const board = new five.Board({/*port: '/dev/ttyACM0',*/ repl: false });

let servo;
board.on('ready', function() {
  console.log('BOARD READY');
  servo = new five.Servo({
    pin: SERVO_PIN
  });
  servo.to(POS_START);
});

serverStart((pos) => servo.to(pos));
