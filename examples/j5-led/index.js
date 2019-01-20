const five = require('johnny-five')

const board = new five.Board({ repl: false })

board.on('ready', function () {
  console.log('BOARD READY')
})
