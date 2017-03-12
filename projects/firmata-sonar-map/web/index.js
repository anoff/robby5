const socket = io.connect(window.location.href);
/*const data = {
    datasets: [
      {
        labels: [...Array(360).keys()],
        data: [...Array(360).fill(4000)]
      }
    ]
  };*/
  const STEP = 5;
  const SIZE = 360/5;
  const data = {
    labels: [...Array(SIZE).keys()].map(e => e * STEP),
    datasets: [
      {
        label: 'robby sonar front',
        backgroundColor: "rgba(60,200,60,0.2)",
        borderColor: "rgba(0,255,0,1)",
        pointBackgroundColor: "rgba(0,227,0,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        data: [...Array(SIZE).fill(0)]
      }
    ]
}

var ctx = document.getElementById('chart');
const chart = new Chart(ctx, {
    type: 'radar',
    data: data,
    options: {
      scale: {
        ticks: {
          beginAtZero: true,
          max: 1000
        }
      }
    }
});

Chart.plugins.register({
  beforeDraw: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = "#999";
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
});
socket.on('data', val => {
  const array = data.datasets[0].data;
  const ix = (180 - val.angle)/5;
  array[ix] = val.value;
  //console.log(`set ${ix} to ${val.value}`)
  window.requestAnimationFrame(render);
  //console.log(data.datasets[0].data)
  //chart.update();
});

function render() {
  chart.update();
}
