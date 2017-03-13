const Board = require('firmata');
const Sonar = require('./lib/sonar');
const Motor = require('./lib/motor');
const pwait = require('./lib/util').pwait;

const server = require('./server');
server.start();

const PIN_SONAR = 4;
const PIN_SERVO = 3;

let STEP = 10;
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
    return sonar.multiPing(2)
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

  const motor1 = new Motor(board, {speed: 5, in1: 7, in2: 6}, {minPWM: 50 });
  const motor2 = new Motor(board, {speed: 11, in1: 9, in2: 8}, {minPWM: 30 });
  // minPWM 20 (30 to start driving..)
  // speed -1..1, yaw = -1..1
  // TODO: calibrate to min/max PWM values so that increasing speed actually moves the thing

  // listen to web commands :o
  server.getSocket().on('connection', socket => {
    console.log('socket connected');
    socket.on('control_update', data => {
      if (data.enabled && data.speed !== 0) {
        const speed = data.speed / 100;
        const yaw = data.yaw / 100;
        if (yaw === 0) {
          motor1.start(speed);
          motor2.start(speed);
        } else {
          const absY = Math.abs(yaw);
          const split = (absY - 0.5) * 2;
          if (yaw > 0) {
            motor1.start(speed);
            motor2.start(speed * -split);
          } else {
            motor1.start(speed * -split);
            motor2.start(speed);
          }
        }
      } else {
        motor1.stop();
        motor2.stop();
      }
    });
  });
});
