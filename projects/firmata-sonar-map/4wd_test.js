const Board = require('firmata');
const Motor = require('./lib/motor');
const pwait = require('./lib/util').pwait;

const server = require('./server');
server.start();

const board = new Board('/dev/ttyUSB0' /*'/dev/cu.usbmodem1421'*/, (err) => {
  // raspi CP2012: /dev/ttyUSB0
  // raspi uno: /dev/ttyACM0
  if (err) {
    throw new Error(err);
  }
  console.log('BOARD READY');

/*
      * 3 ENA, 4 DIR1, 2 DIR2
    * 5 ENB, 6DIR1, 7 DIR2
    * 9 ENA, 8 DIR1, 10 DIR2,
    * 11 ENB, 12 DIR1, 13 DIR2

*/
  const motorFR = new Motor(board, {speed: 3, in1: 2, in2: 4}, {minPWM: 30 });
  const motorFL = new Motor(board, {speed: 5, in1: 6, in2: 7}, {minPWM: 30 });
  const motorRL = new Motor(board, {speed: 9, in1: 10, in2: 8}, {minPWM: 30 });
  const motorRR = new Motor(board, {speed: 11, in1: 12, in2: 13}, {minPWM: 30 });
  // minPWM 20 (30 to start driving..)
  // speed -1..1, yaw = -1..1
  // TODO: calibrate to min/max PWM values so that increasing speed actually moves the thing

  function start(val) {
    // motorFR.start(val);
    motorFL.start(val);
    motorRR.start(val);
    //motorRL.start(val);
  }
  function stop() {
    motorFR.stop();
    motorFL.stop();
    motorRL.stop();
    motorRR.stop();
  }
  start(30);
  setTimeout(() => {
    stop();
  }, 1000);
});
