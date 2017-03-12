const Emitter = require('events').EventEmitter;
const utils = require('./util');
const normalizePin = utils.normalizePin;
const pwait = utils.pwait;

class Sonar extends Emitter {
  constructor(board, pin) {
    super();
    this.board = board;
    this.pin = normalizePin(board, pin);
    this.data = null;
  }

  ping() {
    return new Promise(resolve => {
      this.board.pingRead({
        pin: this.pin,
        value: this.board.HIGH,
        pulseOut: 5
      }, us => {
        const mm = this.responseToMm(us);
        const data = {
          value: mm,
          time: Date.now()
        }
        this.data = data;
        this.emit('data', data);
        resolve(data);
      });
    })
  }

  // execute multiple pings and return all values as array
  multiPing(count) {
    const fns = new Array(count).fill(this.ping);
    return new Promise(resolve => {
      const results = new Array(count);
      return fns.reduce((p, c, i) => {
        return p
          .then(c.bind(this))
          .then(data => results[i] = Object.assign({ index: i }, data)) // update results array
          .then(pwait.bind(null, 50)); // wait 50ms before next one is executed
      }, Promise.resolve())
      .then(() => resolve(results));
    });
  }

  responseToMm(microseconds) {
    return microseconds / 2.91545 / 2;
    // µs / 10e6 µs/s * 343 m/s * 10e3 mm/m -> mm
  }
}

module.exports = Sonar;
