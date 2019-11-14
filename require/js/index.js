requirejs.config({
    baseUrl: '../js/module',
    paths: {
        obj: 'obj',
        math: 'math'
    }
});

requirejs(['obj', 'math'], function(obj, math) {
    console.log(obj, math);
});
