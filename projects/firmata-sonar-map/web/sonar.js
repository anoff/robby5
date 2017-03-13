const socket = io.connect(window.location.href);
/*const data = {
    datasets: [
      {
        labels: [...Array(360).keys()],
        data: [...Array(360).fill(4000)]
      }
    ]
  };*/
  const STEP = 10; // how wide the data points are apart (degree)
  const SIZE = 360/STEP; // calculate the number of data points on the radar chart
  const MAX_SETS = 1; // maximum number of datasets (dynamically spawning seems annoying: http://stackoverflow.com/questions/31059399/how-to-push-datasets-dynamically-for-chart-js-bar-chart)
  let SET_IX = 0; // current index
  const data = {
    labels: [...Array(SIZE).keys()].map(e => e * STEP),
    datasets: [...Array(MAX_SETS).fill(0).map((e, i) => {
        return {
          label: 'run #'+i,
          backgroundColor: "rgba(60,200,60,0.2)",
          borderColor: "rgba(0,255,0,1)",
          pointBackgroundColor: "rgba(0,227,0,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(179,181,198,1)",
          data: [...Array(SIZE).fill(0)]
        };
      })
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
socket.on('sonar_data', val => {
    if (val.angle && val.value) {
      const set = data.datasets[SET_IX].data;
      const ix = (180 - val.angle)/STEP;
      set[ix] = val.value;
      window.requestAnimationFrame(render);
    } else if (val === 'next_set') {
      if (++SET_IX > (MAX_SETS - 1)) {
        SET_IX = 0;
      }
    }
});

 
function render() {
  chart.update();
}
