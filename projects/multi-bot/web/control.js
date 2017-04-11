
const speedSlider = document.querySelector('#speed_slider');
const speedLabel = document.querySelector('#speed_label');
const yawSlider = document.querySelector('#yaw_slider');
const yawLabel = document.querySelector('#yaw_label');
const active = document.querySelector('#active_switch');

socket.on('reconnect', cnt => console.log('reconnect:' + cnt));

let isSliderActive = false;
function sliderUpdate() {
  if (isSliderActive) {
    update(speedSlider.value);
  }
}
// TODO: reset speed to 0 when disabling
function update() {
  if (!active.checked) {
    speedSlider.value = 0;
  }
  const data = {
    speed: speedSlider.value,
    yaw: yawSlider.value,
    enabled: active.checked
  }
  // throttle processing
  window.requestAnimationFrame(() => {
    speedLabel.innerHTML = data.speed;
    socket.emit('control_update', data);
  });
}
function setSpeed(val, yaw) {
  const data = {
    speed: val,
    yaw,
    enabled: val !== 0
  }
  socket.emit('control_update', data);
}
speedSlider.addEventListener('mousedown', () => isSliderActive = true);
speedSlider.addEventListener('mouseup', () => isSliderActive = false);
speedSlider.addEventListener('mouseout', () => isSliderActive = false);
speedSlider.addEventListener('mousemove', sliderUpdate);
speedSlider.addEventListener('click', update);
active.addEventListener('change', update);

// --- arrow inputs ---
window.addEventListener('keydown', e => {
  buttonHandler(e.key);
  toggleStyle(e.key, 'keydown');
});
function toggleStyle(key, event) {
  const button = key.toLowerCase().replace('arrow', 'button');
  if (Object.keys(buttons).indexOf(button.toLowerCase()) > -1) {
    if (event === 'keydown') {
      buttons[button].classList.add('mdl-button--colored');
    } else {
      buttons[button].classList.remove('mdl-button--colored');
    }
  }
}
function buttonHandler(key) {
  switch(key.toLowerCase()) {
    case 'arrowup':
    case 'buttonup':
      setSpeed(30, 0);
      break;
    case 'arrowdown':
    case 'buttondown':
      setSpeed(-30, 0);
      break;
    case 'arrowright':
    case 'buttonright':
      setSpeed(60, 100);
      break;
    case 'arrowleft':
    case 'buttonleft':
      setSpeed(60, -100);
      break;
  }
}
window.addEventListener('keyup', e => {
  setSpeed(0, 0);
  toggleStyle(e.key, 'keyup');
});

// --- button inputs ---
const buttons = {
  buttonup: document.querySelector('#button_up'),
  buttondown: document.querySelector('#button_down'),
  buttonright: document.querySelector('#button_right'),
  buttonleft: document.querySelector('#button_left')
}

Object.keys(buttons).forEach(key => {
  buttons[key].addEventListener('mousedown', () => buttonHandler(key));
  buttons[key].addEventListener('touchstart', () => buttonHandler(key));
  buttons[key].addEventListener('mouseup', () => setSpeed(0, 0));
  buttons[key].addEventListener('mouseout', () => setSpeed(0, 0));
  buttons[key].addEventListener('touchend', () => setSpeed(0, 0));
  buttons[key].addEventListener('touchmove', () => setSpeed(0, 0));
});
