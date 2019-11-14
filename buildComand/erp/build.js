var rootMsg = require('./task.js')
var fileStream = require('fs')

var baseString = fileStream.readFileSync(__dirname + '/base.string', 'utf8')
var html = ''

function warpAnchor(page) {
    return '<li><a href="' + page.url + '">' + page.cnName + '</a></li>'
}

function warpUnit(unit, pages) {
    return '<ul><h2>' + unit.cnName + '(' + unit.name + ')</h2>' + pages + '</ul>';
}

rootMsg.forEach(function (unitData) {
    let pages = ''
    unitData.pages.forEach(function (pageData) {
        pages += warpAnchor(pageData)
    })
    html += warpUnit(unitData, pages)
})
html = baseString.replace(/(<body>)[\s\S]*?(<\/body>)/gm, '$1' + html + '$2');

fileStream.writeFileSync(__dirname + '/map.html', html)