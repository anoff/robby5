const socket = io();
const slider = document.querySelector('#speed_slider');
const speedLabel = document.querySelector('#speed_label');
const active = document.querySelector('#active_switch');

let isSliderActive = false;
function sliderUpdate() {
  if (isSliderActive) {
    update(slider.value);
  }
}
// TODO: reset speed to 0 when disabling
function update() {
  const data = {
    speed: slider.value,
    enabled: active.checked
  }
  // throttle processing
  window.requestAnimationFrame(() => {
    speedLabel.innerHTML = data.speed;
    socket.emit('control_update', data);
  });
}
slider.addEventListener('mousedown', () => isSliderActive = true);
slider.addEventListener('mouseup', () => isSliderActive = false);
slider.addEventListener('mouseout', () => isSliderActive = false);
slider.addEventListener('mousemove', sliderUpdate);
slider.addEventListener('click', update);
active.addEventListener('change', update);
