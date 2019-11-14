function toUnicode(str) {
    var temp,
        i = 0,
        r = '',
        len = str.length;

    for (; i < len; i++) {
        temp = str.charCodeAt(i).toString(16);

        while (temp.length < 4)
            temp = '0' + temp;

        r += '\\u' + temp;
    };

    return r;
}

function fromUnicode(unicode) {
    return unescape(unicode.replace(/(\\u)/g, '%u'));
}

function encodeCV(obj) {
    for (var i in obj) {
        if (typeof(obj[i]) === "string") {
            if (obj.hasOwnProperty(i)) {
                obj[i] = toUnicode(obj[i]);
            }
        }

        if (typeof(obj[i]) === "object") {
            encodeCV(obj[i]);
        }
    }
}

function decodeCV(obj) {
    for (var i in obj) {
        if (typeof(obj[i]) === "string") {
            if (obj.hasOwnProperty(i)) {
                obj[i] = fromUnicode(obj[i]);
            }
        }

        if (typeof(obj[i]) === "object") {
            decodeCV(obj[i]);
        }
    }
}

var mine = {
    "name": "\\u5f90\\u4e91\\u7965",
    "sex": "\\u7537",
    "age": "\\u0032\\u0037",
    "experience": [{
        "time": "\\u0032\\u0030\\u0031\\u0035\\u002e\\u0030\\u0039\\u002e\\u0032\\u0038\\u002d\\u4eca",
        "company": "\\u5317\\u4eac\\u7a7a\\u95f4\\u5bb6",
        "job": "\\u524d\\u7aef\\u5de5\\u7a0b\\u5e08"
    }, {
        "time": "\\u0032\\u0030\\u0031\\u0035\\u002e\\u0030\\u0036\\u002e\\u0030\\u0031\\u002d\\u0032\\u0030\\u0031\\u0035\\u002e\\u0030\\u0039\\u002e\\u0031\\u0037",
        "company": "\\u5317\\u4eac\\u8054\\u8baf\\u52a8\\u529b",
        "job": "\\u8f6f\\u4ef6\\u5de5\\u7a0b\\u5e08"
    }, {
        "time": "\\u0032\\u0030\\u0031\\u0034\\u002e\\u0030\\u0034\\u002e\\u0031\\u0036\\u002d\\u0032\\u0030\\u0031\\u0035\\u002e\\u0030\\u0035\\u002e\\u0031\\u0033",
        "company": "\\u5927\\u8fde\\u8d5b\\u6587\\u8f6f\\u4ef6",
        "job": "\\u8f6f\\u4ef6\\u5de5\\u7a0b\\u5e08"
    }],
    "skill": "\\u006a\\u0073\\u0020\\u0070\\u0068\\u0070\\u0020\\u0068\\u0074\\u006d\\u006c\\u0020\\u0063\\u0073\\u0073\\u0020\\u0063\\u0023\\u0020\\u006a\\u0061\\u0076\\u0061"
};

// var json = JSON.stringify(mine);

// json = json.replace(/(\:)(['"]((.|\n)*?)['"])/g, function(value) {
//     return ':toUnicode(' + value.substr(1) + ')';
// });

// encodeCV(mine);

// console.log(mine.valueOf());
