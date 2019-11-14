var fs = require("fs")
var request = require('request')

// curl -T /export/App/api.shop/image/image__dingding__b__checkbox-checked.png http://upload.dingdingfresh.com:8002/image/upload.png
// /Users/user/documents/my/my/node-test/folder
// curl -T /Users/user/documents/my/my/node-test/folder/image/image__dingding__b__checkbox-checked.png http://upload.dingdingfresh.com:8002/image/upload1.png

var r = request.post('http://upload.dingdingfresh.com:8002/image/upload1.png', function(err, httpResponse, body) {
    console.log(httpResponse)
})

var form = r.form()
var image = __dirname + '/image/image__dingding__b__checkbox-checked.png'
form.append('file', fs.createReadStream(image), { filename: 'image__dingding__b__checkbox-checked.png' });