var fs = require("fs")
var path = require("path")
// npm install --save request
var request = require('request')

// dingdingfresh
// jiashuangkuaizi
// /Users/user/documents/dingding/dd-shop/src/main/resources/static/core
// /Users/user/documents/dingding/dd-shop/src/main/resources/static/dingding
var root = '/Users/user/documents/dingding/dd-shop/src/main/resources/static'
console.log("root: " + root)

var imageArray = []
var imageReg = /(http\:\/\/image\.dingdingfresh\.com)(.*?)(\.(png|jpg|jpeg|bmp|gif))/gmi
readDirSync(root)

function readDirSync(pathArg) {
    var pa = fs.readdirSync(pathArg);
    pa.forEach(function(ele, index) {
        var info = fs.statSync(pathArg + "/" + ele)
        if (info.isDirectory()) {
            console.log("dir: " + ele)
            readDirSync(pathArg + "/" + ele);
        } else {
            console.log("file: " + ele)
            if (ele != '.DS_Store') {
                var content = fs.readFileSync(pathArg + '/' + ele, 'utf8')
                var match = content.match(imageReg)
                if (match && match.length) {
                    imageArray = imageArray.concat(match)
                }
            }
        }
    })
}

console.log(imageArray)
console.log(imageArray.length)

var clear = {}
var clearArray = []
for (var i = imageArray.length - 1; i >= 0; i--) {
    var item = imageArray[i]
    if (clear[item]) continue
    else {
        clear[item] = 1
        // if (/\?/.test(item)) {
        //     clear['http://image.jiashuangkuaizi.com/image/wxapp/bd/site-checked.png'] = 1
        //     clear['http://image.jiashuangkuaizi.com/image/wxapp/bd/site-uncheck.png'] = 1
        // } else {
        //     clear[item] = 1
        // }
    }
}

for (var i in clear) {
    clearArray.push(i)
}
console.log(clearArray.length)


fs.mkdir('image', 0777, function(err) {
    for (var i = clearArray.length - 1; i >= 0; i--) {
        var image = clearArray[i]
        var dir = image.split('http://image.dingdingfresh.com/')[1]

        request(image).pipe(fs.createWriteStream('image/' + dir.replace(/\//g, '__')))
    }
})
fs.writeFileSync(__dirname + '/map.txt', clearArray.join('\n'))