# robby5/multi-bot

> remote control a sonar/camera robot via web

<video width="640" height="480" controls>
  <source src="../../assets/multibot.mp4" type="video/mp4">
</video>

## overview

This project uses a variety of sensors and exposes a web site for remote controlling robby5 via smartphone or laptop connected to the same network.

- 5 fixed sonar sensors and one mounted in front to rotate to a specific position
- two arduinos
- two motor drivers for 4 driven wheels
- one raspberry pi
- one raspberry pi camera

![system overview](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/robby5/master/projects/multi-bot/architecture.iuml)

## usage

To setup you need to install the main project directory as well as `./web` directory

```sh
cd projects/multi-bot
npm install
cd web
npm install
```

You can start the app incl the web server with `node index`

## setup

see above for a component overview; the PIN setup is currently only available [in code](./index.js)