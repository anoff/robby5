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
*  I2C communication via [arduino wire library](https://www.arduino.cc/en/Main/Reference/Wire) and A4 (SDA) & A5 (SCL)
* [Example I2C](http://www.learningaboutelectronics.com/Articles/Multiple-I2C-devices-to-an-arduino-microcontroller.php)
* [technical specs](https://www.arduino.cc/en/Main/arduinoBoardProMini#techspecs)

If I2C is active still 12 digital pins useable > could expose 6 ultrasonic sensors via I2C while reserving serial port.
