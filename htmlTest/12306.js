var _12306 = {

    init: function() {
        _12306.ajax({
            url: 'https://kyfw.12306.cn/otn/lcxxcx/query?purpose_codes=ADULT&queryDate=2017-01-24&from_station=BJP&to_station=HSN',
            success: function(data) {

            }
        });
    },

    ajax: function(args) {

        var options = {
            url: '',
            type: 'get',
            data: {},
            dataType: ''
            success: null,
            error: null,
            complete: null
        };

        for (var i in args) {
            options[i] = args[i];
        }

        var xhr = new XMLHttpRequest();

        var formData = new FormData();

        for (var i in options.data) {
            formData.append(i, options.data[i]);
        }

        xhr.onreadystatechange = function() {
            var data = xhr.responseText;

            if (options.dataType == 'json') {
                data = JSON.parse(xhr.responseText);
            }

            doneAsFunction(options.complete, data);
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    doneAsFunction(options.success, data);
                } else {
                    doneAsFunction(options.error, data);
                }
            }
        }

        xhr.open(options.type, options.url);

        xhr.send(formData);

        function doneAsFunction(isFunc, args) {
            if ('function' == typeof isFunc) {
                isFunc(args);
            }
        }
    }
}

window.onload = _12306.init;
