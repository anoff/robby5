const Board = require('firmata');
const Sonar = require('./lib/sonar');
const Motor = require('./lib/motor');
const pwait = require('./lib/util').pwait;

const server = require('./server');
server.start();

const SONARS = [
  {
    angle: 90,
    pin: 10
  },
  {
    angle: 120,
    pin: 4
  },
  {
    angle: 60,
    pin: 6
  },
  {
    angle: 300,
    pin: 3
  },
  {
    angle: 240,
    pin: 12
  }
]
const PIN_SONAR = 8;
const PIN_SERVO = 3;

let STEP = 20;
const MIN = 0, MAX = 180;
let servoPos = MIN;

function median(values) {
  values.sort( function(a,b) {return a - b;} );
  var half = Math.floor(values.length/2);
  if(values.length % 2) {
    return values[half];
  }
  else {
    return (values[half-1] + values[half]) / 2.0;
  }
}

function promisifyBoard(port) {
  return new Promise((resolve, reject) => {
    const board = new Board(port, err => {
      if (err) {
        reject(err);
      }
      resolve(board);
    })
  })
}
Promise.all([
  promisifyBoard('/dev/ttyACM0'),
  promisifyBoard('/dev/ttyUSB0')
])
.then(boards => {
  const sonarBoard = boards[0];
  const motorBoard = boards[1];

  console.log('BOARDS READY');

  const sonars = SONARS.map(elm => {
  const s = new Sonar(sonarBoard, elm.pin);
    s.angle = elm.angle;
    return s;
  });

  let sonarCnt = 0;
  function scan() {
    const sonar = sonars[sonarCnt];
    return sonar.multiPing(3, 0)
    .then(results => {
      const data = {
        angle: sonar.angle,
        value: median(results.map(e => e.value))
      }
      //console.log(`${data.value} @ ${data.angle}°`);
      return server.getSocket().emit('sonar_data', data);
    })
    //.then(() => pwait.bind(null, 40))
    .then(() => {
      sonarCnt++;
      if (sonarCnt >= sonars.length) {
        sonarCnt = 0;
      }
      scan(); // recursively go wild
    });
  }
  scan(); // start scanning rampage


  const motorFR = new Motor(motorBoard, {speed: 3, in1: 2, in2: 4}, {minPWM: 30 });
  const motorFL = new Motor(motorBoard, {speed: 5, in1: 6, in2: 7}, {minPWM: 30 });
  const motorRL = new Motor(motorBoard, {speed: 9, in1: 10, in2: 8}, {minPWM: 30 });
  const motorRR = new Motor(motorBoard, {speed: 11, in1: 12, in2: 13}, {minPWM: 30 });
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

  //[motorFR, motorFL, motorRL, motorRR].forEach(m => m.start(0.2))
  //setTimeout(() => [motorFR, motorFL, motorRL, motorRR].forEach(m => m.stop()), 500)

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
})
