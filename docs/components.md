overview of used components
===


# HC-SR04 ultrasonic distance sensor

Price: `~2€` (5 for 9€)

required pins: `2` digital

VCC: `5V`


Can measure `2cm - 400cm` measurements using 40kHz measurements. Trigger measurement via 5V signal on `trigger` pin for 10µs, read the `echo` pin pulse duration (Arduino [pulseIn](https://www.arduino.cc/en/Reference/pulseIn)) for the HIGH level.

`distance in cm = highDuration / 58.2`

More info [available here](http://www.electrodragon.com/w/HC-SR04_Ultrasonic_sensor)

# Arduino Pro Mini

Price: `~3€` (5 for 12€)

VCC: `3.3/5V`

pins: `14` digital, `6` PWM, `6` analog, SPI, I2C

* needs USB2TTL interface to program
  * might need [CP2102 USB-to-Serial drivers](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers)
  * on CP2012 [manual restart](http://lab.dejaworks.com/programming-arduino-mini-pro-with-cp2102-usb-to-ttl-serial-converter/) is required as soon as sketch compilation in arduino is done
  * FTDI flashers seem to work better and come with auto-reset, need to evaluate
*  I2C communication via [arduino wire library](https://www.arduino.cc/en/Main/Reference/Wire) and A4 (SDA) & A5 (SCL)
* [Example I2C](http://www.learningaboutelectronics.com/Articles/Multiple-I2C-devices-to-an-arduino-microcontroller.php)
* [technical specs](https://www.arduino.cc/en/Main/arduinoBoardProMini#techspecs)

If I2C is active still 12 digital pins useable > could expose 6 ultrasonic sensors via I2C while reserving serial port.

# raspberry pi (3)

Price: `35€`

VCC: `5V`

PIN voltage: `3.3V`

> 🚨⚠️ needs level shifter

As the raspi can run a full debian system it and v3 comes with built-in wifi and bluetooth it's perfect to act as the main hub.
You can implement full webservers host a small database on the side etc.


libraries to use with nodeJS:
* [raspi-io](https://github.com/nebrius/raspi-io/): Low level API for wiringpi
* [raspi.js](https://github.com/nebrius/raspi): JS API for rasp-io
* [pin layout](https://pinout.xyz/)
* [johnny-five](http://johnny-five.io/)
