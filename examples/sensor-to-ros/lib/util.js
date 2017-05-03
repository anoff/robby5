
/**
 * @description Convert 'A0' to pin number.
 * 
 * @param {Board}   board       firmatajs Board instance 
 * @param {String}  analogPin   string representing an analog pin (e.g. 'A2')
 * @returns {Number}            pin number according to board.pin
 */
function absAnalogPin(board, analogPin) {
  if (!board.analogPins) {
    throw new Error('should be used in context of a valid firmata board');
  }
  const id = parseInt(analogPin.slice(1));
  return board.analogPins[id];
}

/**
 * @description Make sure it returns a normal pin.
 * 
 * @param {Board} board           firmatajs Board instance
 * @param {String/Number} pin     pin name
 * @returns {Number}
 */
function normalizePin(board, pin) {
  if (typeof pin === 'string' && pin.toLowerCase().indexOf('a') === 0) {
    return absAnalogPin(board, pin);
  } else if (typeof pin === 'number') {
    return pin;
  }
  throw new Error(`Unknown pin style: ${pin}`);
}

function pwait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
  absAnalogPin,
  normalizePin,
  pwait
};
