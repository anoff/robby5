raspi led
===

> basic LED interactions on a raspberry pi

![screenshot](./screenshot.png)

# Setup

Follow the base setup of the johnny-five LED example

![breadboard setup](http://johnny-five.io/img/breadboard/led-13-raspberry-pi.png)

# Usage

`Make sure you do these steps on a raspberry pi`

* install prerequisites `sudo apt-get install wiringpi` (might crash if you don't have git)
* install dependencies (`yarn` seems to cause errors, use `npm install` instead)
* run the code with root priviledges ``sudo `which node` index``
* see your LED blinking

> You can also use [remote-code](https://github.com/anoff/remote-code) if you don't want to work manually on your pi.
