var request = require('request');
var fs = require('fs');

var ext = '.jpg';
var pipe = 'cmd/15/a_';

var maxNum = 112;
var globleUrl = '';

//try {
download_cos();
//}
//caych(e) {
//	console.log(e);
//}

function getPic(numStart, numEnd) {
    if (!numStart) {
        return;
    } else if (!numEnd) {
        numEnd = numStart + 10;
    }
    for (var i = numStart; i < numEnd; i++) {
        if (i > maxNum) {
            return;
        }
        var url = getUrl(i);
        request(url).pipe(fs.createWriteStream(pipe + i + ext));
        console.log(pipe + i + ext + '......下载成功');
    }
    return numEnd;
}

function getUrl(num) {
    num = num < 10 ? ('0' + num) : num;
    var url = globleUrl + num + ext;
    return url;
}

function download_cos() {
    var num = 1;
    setInterval(function() {
        num = getPic(num, num + 10);
    }, 8000);
}
