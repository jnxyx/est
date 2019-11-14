function deepCopy(obj) {
    if ('object' != typeof obj) {
        return obj
    }
    var returnVal = obj.constructor.name == 'Array' ? [] : {};
    for (let i in obj) {
        returnVal[i] = 'object' == typeof obj[i] ? arguments.callee(obj[i]) : obj[i]
    }
    return returnVal;
}

function jsonCopy(obj) {
    if ('object' != typeof obj) {
        return obj
    }
    return JSON.parse(JSON.stringify(obj))
}