const value = 90;
const myClientId = null;

// render servo position
const chart = new RadialProgressChart('.servoctrl', {
    series: [0],
    diameter: 360,
    min: 0,
    max: 180,
    animation: {
        duration: 1,
        delay: 0
    },
    center: function(d) {
        return d
    }
});

// connect to server
const socket = io.connect(window.location.href);
socket.on('connect', function() {
    console.log('socket.io connected');
});
socket.on('welcome', function(data) {
    console.log(`received welcome: ${JSON.stringify(data)}`);
    document.querySelector('#clientId').innerHTML = data.clientId;
    chart.options.min = data.min;
    chart.options.max = data.max;
    chart.update(data.value);
});

// handle remote changes
socket.on('value', function (data) {
    console.log(`new value received: ${data.value}`);
    chart.update(data.value);
});

// handle local changes
document.querySelector('.value_minus').addEventListener('click', function() {
    socket.emit('ui_change', -10); // UI will only be updated after plausiblizing the value on the server
});
document.querySelector('.value_plus').addEventListener('click', function() {
    socket.emit('ui_change', 10)
});

