var robot = require("robotjs");

var size = 200;
var img = robot.screen.capture(0, 0, size, size);
// Support for higher density screens.
var multi = img.width / size;
// Get color at 2, 3.
var color = img.colorAt(2 * multi, 3 * multi);
