var fs = require('fs')
var program = require('commander')

var obj = {}
var processStr = ''
var array = []
for (var i in process) {
    // JSON.stringify(obj[i])
    obj[i] = process[i]
    if (array.indexOf(obj[i]) == -1) {
        array.push(obj[i])
        var string = typeof obj[i] == 'object' ? '' : obj[i]
        processStr += 'process[' + i + ']:' + string + '\n'
    }
}

program
    .parse(process.argv)

fs.writeFileSync(__dirname + '/process.text.js', JSON.stringify(program.args))
// fs.writeFileSync(__dirname + '/process.text.js', processStr)