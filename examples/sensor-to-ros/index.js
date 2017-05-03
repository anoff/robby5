const Board = require('firmata');
const Sonar = require('./lib/sonar');
const Motor = require('./lib/motor');
const pwait = require('./lib/util').pwait;

const PIN_SONAR = 8;
const PIN_SERVO = 3;

let STEP = 20;
const MIN = 0, MAX = 180;
let servoPos = MIN;

const sonarBoard = new Board('/dev/ttyACM0', err => {
  if (err) {
    throw new Error(err);
  }
  console.log('SONAR READY');
  const sonar = new Sonar(sonarBoard, PIN_SONAR);
  sonarBoard.servoConfig(PIN_SERVO, 660, 1300);
  const servoTo = sonarBoard.servoWrite.bind(sonarBoard, PIN_SERVO);

  servoTo(servoPos);

  const nextPos = () => {
    const tmp = servoPos + STEP;
    if (tmp > MAX || tmp < MIN) {
      // change servo direction
      STEP *= -1;
    }
    return servoPos += STEP;
  };
  const scan = () => {
    // execute 4 pings
    return sonar.multiPing(1)
    // select the reading with the smallest distance
    .then(arr => arr.reduce((c, p) => p.value < c.value ? p : c, { value: Infinity }))
    // add current servo position to the data object
    .then(data => Object.assign({angle: servoPos}, data))
    // send new data to web server
    .then(data => {
      console.log(`${data.value}(${data.index}) @ ${data.angle}°`);
    })
    // move to next position
    .then(() => servoTo(nextPos()))
    // wait 20ms for servo to move
    .then(pwait.bind(null, 80))
    // trigger next scan
    .then(scan);
  }
  // start scanning
  scan();
})
