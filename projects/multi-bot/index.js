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

const sonarBoard = new Board('/dev/cu.usbmodem1411', err => {
  if (err) {
    throw new Error(err);
  }
  console.log('SONAR READY');
  const sonars = SONARS.map(elm => {
    const s = new Sonar(sonarBoard, elm.pin);
    s.angle = elm.angle;
    return s;
  });

  let sonarCnt = 0;
  function scan() {
    const sonar = sonars[sonarCnt];
    return sonar.ping()
    .then(data => {
      data.angle = sonar.angle;
      // console.log(`${data.value} @ ${data.angle}°`);
      return server.getSocket().emit('sonar_data', data);
    })
    .then(() => pwait.bind(null, 40))
    .then(() => {
      sonarCnt++;
      if (sonarCnt >= sonars.length) {
        sonarCnt = 0;
      }
      scan(); // recursively go wild
    });
  }
  scan(); // start scanning rampage
});
