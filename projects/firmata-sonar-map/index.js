const Board = require('firmata');
const Sonar = require('./lib/sonar');
const Motor = require('./lib/motor');
const pwait = require('./lib/util').pwait;

const server = require('./server');
server.start();

const PIN_SONAR = 4;
const PIN_SERVO = 3;

let STEP = 5;
const MIN = 0, MAX = 180;
let servoPos = MIN;

const board = new Board('/dev/ttyACM0'/*'/dev/cu.usbmodem1421'*/, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log('BOARD READY');
  const sonar = new Sonar(board, PIN_SONAR);
  board.servoConfig(PIN_SERVO, 660, 1300);
  const servoTo = board.servoWrite.bind(board, PIN_SERVO);

  servoTo(servoPos);

  const nextPos = () => {
    const tmp = servoPos + STEP;
    if (tmp > MAX || tmp < MIN) {
      // change servo direction
      STEP *= -1;
      // create a new dataset on the website
      server.getSocket().emit('sonar_data', 'next_set');
    }
    return servoPos += STEP;
  };
  const scan = () => {
    // execute 4 pings
    return sonar.multiPing(4)
    // select the reading with the smallest distance
    .then(arr => arr.reduce((c, p) => p.value < c.value ? p : c, { value: Infinity }))
    // add current servo position to the data object
    .then(data => Object.assign({angle: servoPos}, data))
    // send new data to web server
    .then(data => {
      console.log(`${data.value}(${data.index}) @ ${data.angle}°`);
      server.getSocket().emit('sonar_data', data);
    })
    // move to next position
    .then(() => servoTo(nextPos()))
    // wait 20ms for servo to move
    .then(pwait.bind(null, 20))
    // trigger next scan
    .then(scan);
  }
  // start scanning
  //scan();

  const motor1 = new Motor(board, {speed: 5, in1: 7, in2: 6}, {minPWM: 50});
  const motor2 = new Motor(board, {speed: 11, in1: 9, in2: 8}, {minPWM: 50});
  // minPWM 20 (30 to start driving..)
  // speed -1..1, yaw = -1..1
  // TODO: calibrate to min/max PWM values so that increasing speed actually moves the thing
  function move(speed, yaw) {
    motor1.start(speed);
    motor2.start(speed);
  }
  function stop() {
    motor1.stop();
    motor2.stop();
  }
  // listen to web commands :o
  server.getSocket().on('connection', socket => {
    console.log('socket connected');
    socket.on('control_update', data => {
      if (data.enabled && data.speed !== 0) {
        move(data.speed / 100);
      } else {
        stop();
      }
    });
  });
});
