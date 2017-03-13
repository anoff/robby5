
class Motor {
  constructor(board, pins, opts) {
    if (!pins.speed || !pins.in1 || !pins.in2) {
      throw new Error('specify proper pins object {speed, in1, in2}');
    }
    this.board = board;
    this.pins = pins;
    this.board.pinMode(pins.speed, this.board.MODES.PWM);
    this.options = {
      minPWM: opts.minPWM || 0,
      maxPWM: opts.maxPWM || 255
    }
  }

  // speed = -1..1
  start(speed) {
    const reverse = Math.sign(speed) === -1;
    const min = this.options.minPWM;
    const max = this.options.maxPWM;
    let pwm = min + Math.abs(speed) * (max - min);
    pwm = Math.max(Math.min(max, pwm), min);
    if (reverse) {
      this.board.digitalWrite(this.pins.in1, this.board.HIGH);
      this.board.digitalWrite(this.pins.in2, this.board.LOW);
    } else {
      this.board.digitalWrite(this.pins.in1, this.board.LOW);
      this.board.digitalWrite(this.pins.in2, this.board.HIGH);
    }
    this.board.analogWrite(this.pins.speed, pwm);
  }

  stop() {
    this.board.analogWrite(this.pins.speed, 0);
    this.board.digitalWrite(this.pins.in1, this.board.LOW);
    this.board.digitalWrite(this.pins.in2, this.board.LOW);
  }
}

module.exports = Motor;

