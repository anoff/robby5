const firmata = require('firmata');
const j5 = require('johnny-five');

const SERVO_PIN = 3;
const POS_MAX = 180;
const POS_MIN = 0;
let servoPos = 90;
let stepInterval = 5; // stepsize (deg) of servo

// start the johnny-five connection
const board = new firmata.Board('/dev/ttyACM0', err => {
    err && console.error(err);
});

let moving = false;
function moveServo(pos, pause = 30) {
  if (moving) return;
  moving = true;
  board.servoWrite(SERVO_PIN, pos);
  setTimeout(() => moving = false, pause);
}
function stepServo() {
  servoPos += stepInterval;
  moveServo(servoPos);
}

board.on('ready', function(err) {
  console.log('BOARD READY');
  board.servoConfig(SERVO_PIN, POS_MIN, POS_MAX);
  moveServo(servoPos);
});

var pingBoard = new j5.Board({port: '/dev/ttyUSB0', repl: false});

pingBoard.on("ready", function() {
  const sonar = new j5.Proximity({
    controller: 'HCSR04',
    pin: 'A0'
  });

  sonar.on('data', function() {
    if (this.cm > 20 && !moving) {
      console.log(`can not see anything at ${servoPos} moving along`);
      if (stepInterval > 0) {
        if (servoPos < POS_MAX) {
          stepServo();
        } else {
          stepInterval = -1 * stepInterval;
          stepServo();
        }
      } else {
        if (servoPos > POS_MIN) {
          stepServo();
        } else {
          stepInterval = -1 * stepInterval;
          stepServo();
        }
      }
    }
  });
});
