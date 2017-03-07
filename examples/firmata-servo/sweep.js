const five = require('johnny-five');

const SERVO_PIN = 3;

// start the johnny-five connection
const board = new five.Board({/*port: '/dev/ttyACM0',*/ repl: false });

let servo;
board.on('ready', function() {
  console.log('BOARD READY');
  servo = new five.Servo({
    pin: SERVO_PIN
  });
  servo.to(0);
  setTimeout(() => servo.sweep(), 2000);
});
