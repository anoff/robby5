const five = require("johnny-five");
var express = require("express");
var path = require("path");
var app = express();


// Config:
var config = {
    "socketio_port": 4242
}
var server = app.listen(config.socketio_port, function() {
    console.log(Date.now() + " [socket.io] LISTENING on port " + config.socketio_port);
});
var io = require("socket.io").listen(server);

// Make directory "/gui" public available:
app.use(express.static(path.join(__dirname, "gui")));

// Serve "index.html":
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

const board = new five.Board({port: '/dev/ttyACM0', repl: false });


console.log('STARTING');
let servo;
board.on("ready", function() {
  console.log('BOARD READY');
  servo = new five.Servo({
    pin: 3,
    center: true
  });
});

// Store data:
var value = 90; // Current value // TODO: Replace with "speed"
var client_id = 0; // Running number that is assigned to the clients

// Manipulate data:
function updateValue(currValue, updateValue) {

    // Handle positive and negative values different:
    if (updateValue > 0) {
        if (currValue <= (180 - updateValue)) {
            currValue += updateValue;
        }
    } else if (updateValue < 0) {
        if (currValue >= -updateValue) {
            currValue += updateValue;
        }
    }
    return currValue;
}


//
//      FUNCTIONS
//

// Emit new value to all clients:
function emitValue(value) {
    console.log("[socket.io] Value updated: " + value);
    servo.to(value);
    io.sockets.emit("value_update", value);
}

// Communicate with clients:
io.sockets.on("connection", function(socket) {

    // Send welcome message and initial value to new client:
    console.log(Date.now() + " [socket.io] Another client has connected.");
    console.log(Date.now() + " [socket.io] SENDING \"welcome\" event to new client.");
    socket.emit("welcome", {
        "message": "Hello World!",
        "client_id": client_id
    });
    client_id++;
    console.log(Date.now() + " [socket.io] SENDING \"value_update\" event to new client: " + value);
    socket.emit("value_update", value);

    // Listen to events from client:
    socket.on("user_agent", function (data) {
        console.log(Date.now() + " [socket.io] RECEIVING \"user agent\" event from client: " + data);
    });

    socket.on("gui_value_update", function(data) {
        console.log(Date.now() + " [socket.io] RECEIVING \"gui_value_update\" event from client: " + data);
        value = updateValue(value, data);
        emitValue(value);
    });

});
