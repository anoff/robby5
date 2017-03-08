const raspi = require('raspi');
const gpio = require('raspi-gpio');

raspi.init(() => {
  const led = new gpio.DigitalOutput('P1-13');
  let state = 0;
  led.write(1);
  /*setInterval(() => {
    console.log('change');
    led.write(state ^= 1);
  }, 500)*/
});
// TODO: doesn't work yet.. no idea why :(
