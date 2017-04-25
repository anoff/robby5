const express = require('express');
const raspividStream = require('raspivid-stream');

const app = express();
const wss = require('express-ws')(app);

//app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use(express.static(__dirname + '/public'));
app.ws('/', (ws, req) => {
    console.log('Client connected');

    ws.send(JSON.stringify({
      action: 'init',
      width: '640',
      height: '480'
    }));

    var videoStream = raspividStream({
      framerate: 42,
      width: 640,
      height: 480,
      awb: 'fluorescent',
      rotation: 180
    });

    videoStream.on('data', (data) => {
        ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
    });

    ws.on('close', () => {
        console.log('Client left');
        videoStream.removeAllListeners('data');
    });
});

app.use(function (err, req, res, next) {
  console.error(err);
  next(err);
})

app.listen(3030, () => console.log('Server started on 3030'));
