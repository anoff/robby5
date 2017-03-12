const socket = io.connect(window.location.href);
const slider = document.querySelector('#speed_slider');
const speedLabel = document.querySelector('#speed_label');
const active = document.querySelector('#active_switch');

let isSliderActive = false;
function sliderUpdate() {
  if (isSliderActive) {
    update(slider.value);
  }
}
function update() {
  const data = {
    speed: slider.value,
    active: active.checked
  }
  speedLabel.innerHTML = data.speed;
  socket.emit('control_update', data);
}
slider.addEventListener('mousedown', () => isSliderActive = true);
slider.addEventListener('mouseup', () => isSliderActive = false);
slider.addEventListener('mouseout', () => isSliderActive = false);
slider.addEventListener('mousemove', sliderUpdate);
slider.addEventListener('click', update);
active.addEventListener('change', update);
