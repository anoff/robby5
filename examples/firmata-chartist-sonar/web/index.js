const socket = io.connect(window.location.href);
const data = {
    series: [
      new Array(100)
    ]
  };

const chart = new Chartist.Line('#chart', data, {
  low: 0,
  high: 100,
  showArea: true,
  showPoint: false,
  showGrid: false
});

socket.on("cm_value", function (cm) {
  data.series[0].push(cm);
  data.series[0].shift();
  window.requestAnimationFrame(render);
});

function render() {
  chart.update(data);
}
