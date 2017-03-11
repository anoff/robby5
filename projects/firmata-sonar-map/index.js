const Board = require('firmata');
const Sonar = require('./lib/sonar');

const PIN = 'A0';
const board = new Board('/dev/cu.usbmodem1411', () => {
  console.log('BOARD READY');
  const sonar = new Sonar(board, PIN);

  const scan = () => {
    sonar.multiPing(4)
    .then(arr => console.log(Math.min(...arr)))
    .then(scan);
  }
  scan();
});
