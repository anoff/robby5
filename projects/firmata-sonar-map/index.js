const Board = require('firmata');
const Sonar = require('./lib/sonar');
const Motor = require('./lib/motor');
const pwait = require('./lib/util').pwait;

const server = require('./server');
server.start();

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
      // create a new dataset on the website
      server.getSocket().emit('sonar_data', 'next_set');
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
      server.getSocket().emit('sonar_data', data);
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

const board = new Board('/dev/ttyUSB0'/*'/dev/cu.usbmodem1421'*/, (err) => {
  // raspi CP2012: /dev/ttyUSB0
  // raspi uno: /dev/ttyACM0
  if (err) {
    throw new Error(err);
  }
  console.log('MOTOR READY');

  const motorFR = new Motor(board, {speed: 3, in1: 2, in2: 4}, {minPWM: 30 });
  const motorFL = new Motor(board, {speed: 5, in1: 6, in2: 7}, {minPWM: 30 });
  const motorRL = new Motor(board, {speed: 9, in1: 10, in2: 8}, {minPWM: 30 });
  const motorRR = new Motor(board, {speed: 11, in1: 12, in2: 13}, {minPWM: 30 });
  // minPWM 20 (30 to start driving..)
  // speed -1..1, yaw = -1..1
  // TODO: calibrate to min/max PWM values so that increasing speed actually moves the thing

  const motor1 = {
    start: val => { motorRL.start(val); motorFL.start(val); },
    stop: val => { motorRL.stop(); motorFL.stop(); }
  };
  const motor2 = {
    start: val => { motorRR.start(val); motorFR.start(val); },
    stop: val => { motorRR.stop(); motorFR.stop(); }
  };
  
  // listen to web commands :o
  server.getSocket().on('connection', socket => {
    console.log('socket connected');
    socket.on('control_update', data => {
      console.log(data);
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
