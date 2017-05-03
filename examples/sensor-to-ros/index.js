const Board = require('firmata');
const Sonar = require('./lib/sonar');
const Motor = require('./lib/motor');
const pwait = require('./lib/util').pwait;
const rosnodejs = require('rosnodejs');

const sensor_msgs = rosnodejs.require('sensor_msgs');

const PIN_SONAR = 8;
const PIN_SERVO = 3;

let STEP = 20;
const MIN = 0, MAX = 180;
let servoPos = MIN;

rosnodejs.initNode('sensor_to_ros', {messages: ['sensor_msgs/Range']})
.then( (nodeHandle) => {
    distance_publisher = nodeHandle.advertise('/front_ultrasonic', 'sensor_msgs/Range');
    const sonarBoard = new Board('/dev/ttyACM0', err => {
        let seq_no = 0;
        if (err) {
        throw new Error(err);
        }
        console.log('SONAR READY');
        const sonar = new Sonar(sonarBoard, PIN_SONAR);
        sonarBoard.servoConfig(PIN_SERVO, 660, 1300);
        const servoTo = sonarBoard.servoWrite.bind(sonarBoard, PIN_SERVO);

        servoTo(servoPos);

        const nextPos = () => {
        const tmp = servoPos + STEP;
        if (tmp > MAX || tmp < MIN) {
        // change servo direction
        STEP *= -1;
        }
        return servoPos += STEP;
        };
        const scan = () => {
        // execute 4 pings
          return sonar.multiPing(1)
            // select the reading with the smallest distance
            .then(arr => arr.reduce((c, p) => p.value < c.value ? p : c, { value: Infinity }))
            // add current servo position to the data object
            .then(data => Object.assign({angle: servoPos}, data))
            // send new data to web server
            .then(data => {
                console.log(`${data.value}(${data.index}) @ ${data.angle}°`);
                // publish the distance to ros
                msg = new sensor_msgs.msg.Range();
                now_ms = Date.now();
                msg.header.stamp.secs = Math.floor(now_ms / 1000);
                msg.header.stamp.nsecs = (now_ms % 1000) * 1000000;
                msg.header.frame_id = 'rotating_sonar'
                msg.header.seq = seq_no;
                msg.radiation_type = sensor_msgs.msg.Range.ULTRASOUND;
                msg.field_of_view = 0.04; // 15 deg opening angle
                msg.min_range = 0.1;
                msg.max_range = 4.0;
                msg.range = data.value / 1000; // convert from mm to m
                distance_publisher.publish(msg);
                seq_no += 1;
                })
          // move to next position
          .then(() => servoTo(nextPos()))
            // wait 20ms for servo to move
            .then(pwait.bind(null, 80))
            // trigger next scan
            .then(scan);
        }
        // start scanning
        scan();
    })
});

