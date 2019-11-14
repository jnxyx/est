var xhr = new XMLHttpRequest();

var formData = new FormData();
formData.append("handlekey", "pollresult");
formData.append("id", 244);
formData.append("formhash", "bb497265");
formData.append("iframe", 2);
formData.append("bgcolor", "022d6c");
formData.append("choose_value", "6827");

xhr.open("POST", '');
// xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.35');

xhr.send(formData);

var fn1 = function() {
    this._fn.apply(this, arguments);
    return true;
}

var app = {
    fn2: fn1.bind({
        _fn: function(data) {
            console.log(data);
        }
    })
}

var result = app.fn2(123);
