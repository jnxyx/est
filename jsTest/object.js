var obj = {
    name: 'name',
    age: '18',
    collage: 'vgSchool'
}

Object.keys(obj).forEach(function (item) {
    obj[item] += item
})