// Get pixel color under the mouse.
var robot = require("robotjs");
var fs = require('fs')

setInterval(() => {

    var mouse = robot.getMousePos()
    var hex = robot.getPixelColor(mouse.x, mouse.y)

    let string = "#" + hex + " at x:" + mouse.x + " y:" + mouse.y + '\n'
    if (hex === 'ffffff') {
        robot.mouseClick()
    }
    fs.appendFileSync(__dirname + '/screen.txt', string)

}, 1000)