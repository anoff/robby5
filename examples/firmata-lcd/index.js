const Board = require('firmata');

const ADDRESS = 0x78; // i2c target ADDRESS
// https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf

const b = new Board('/dev/cu.usbmodem1411', () => {
  console.log('BOARD READY');

  b.i2cConfig(0);
  // https://www.amazon.de/forum/-/TxWNQT5QHO0LT1/ref=ask_dp_dpmw_al_hza?asin=B00NHKM1C0
  b.i2cWrite(ADDRESS, 0x00, [
    0xae,
    0xd5,
    0x80,
    0xa8,
    0x3f,
    0xd3,
    0x00,
    0x40,
    0x8d,
    0x14,
    0x20,
    0x00,
    0xa1,
    0xc8,
    0x12,
    0x81,
    0xcf,
    0xd9,
    0xf1,
    0xdb,
    0x40,
    0xa4,
    0xa6,
    0xaf]);

  const img = 
    '00011000'+
    '00111100'+
    '01111110'+
    '11111111'+
    '01100110'+
    '01100110'+
    '01100110'+
    '00000000';
  img.split('').forEach(char => {
    const n = parseInt(char);
    b.i2cWriteReg(ADDRESS, 0x40, n);
  });
})
