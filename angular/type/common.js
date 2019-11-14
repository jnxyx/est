var myConfig = {
    baseUrl: globalTool.staticPath,
    // urlArgs: "?v=1.0",
    paths: {
        'jquery': 'lib/jquery.min.js',
        'angular': 'lib/angular/angular.min.js',
        'angular-route': 'lib/angular/angular-route.min.js'
    },
    getFiles: function(name) {
        var files = this.paths[name];
        if (!files) {
            return '';
        }
        if (!$.isArray(files)) {
            files = files.indexOf('http') == -1 ? (this.baseUrl + files) : files;
            return [files];
        }
        var result = [];
        for (var i = 0; i < files.length; i++) {
            var filePath = files[i].indexOf('http') == -1 ? (this.baseUrl + files[i]) : files[i];
            result.push(filePath);
        }
        return result;
    }
};

globalTool = {
    staticPath: '/',
    ajax: function(http, args) {
        if (args) {
            addAjaxLoading();
            return ngAjax(); //angular ajax
        } else {
            args = http; //angular ajax
            addAjaxLoading();
            return jqAjax();
        }

        function jqAjax() {
            var options = {
                type: args.type || 'POST',
                dataType: args.dataType || 'json',
                async: args.async == false ? false : true,
                data: args.data,
                url: args.url,
                success: successCallback,
                error: errorCallback
            };
            if (args.args) {
                options.url += "/" + JSON.stringify(args.args) + "/";
            }

            return $.ajax(options);
        }

        function ngAjax() {
            if (args.type == 'get' || args.type == 'GET') {
                http.get(args.url, args.data).success(successCallback).error(errorCallback);
            } else {
                http.post(args.url, args.data).success(successCallback).error(errorCallback);
            }
        }

        function successCallback(result) {
            //处理失败后的响应
            removeAjaxLoading();

            args.success(result);

            if (args.complete) {
                args.complete(result);
            }
        }

        function errorCallback(result) {
            //处理失败后的响应
            removeAjaxLoading();
            args.error.call(window, result);
            if (args.complete) {
                args.complete(result);
            }
        }

        function addAjaxLoading() {
            if (args.loading === true) {
                myCommon.removeItem(myCommon.requestingUrls, args.url);
                myCommon.requestingUrls.push(args.url);
                myCommon.showLoading();
            } else if (args.loading) {
                myCommon.showLoading(args.loading);
            }
        }

        function removeAjaxLoading() {
            if (args.loading === true) {
                myCommon.removeItem(myCommon.requestingUrls, args.url);
                if (myCommon.requestingUrls.length == 0) {
                    myCommon.hideLoading();
                }
            } else if (args.loading) {
                myCommon.hideLoading(args.loading);
            }
        }
    },
    //通过字段key,查找数据的某条数据
    getItem: function(array, value, key) {
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item[key] == value) {
                return item;
            }
        }
        return null;
    },
    removeItem: function(array, value, key) {
        if (key) {
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                if (item[key] == value) {
                    array.splice(i, 1);
                    break;
                }
            }
        } else {
            var start = $.inArray(value, array);
            if (start > -1) {
                array.splice(start, 1);
            }
        }
    },
    //加载js,css,html文件
    load: function(srcs) {
        return {
            deps: ['$ocLazyLoad', '$q', function($ocLazyLoad, $q) {
                srcs = angular.isArray(srcs) ? srcs : [srcs];
                var deferred = $q.defer();
                var promise = deferred.promise;
                angular.forEach(srcs, function(src) {
                    promise = promise.then(function() {
                        var netSrc = src.indexOf('http') != -1 ? src : false;
                        var files = myConfig.getFiles(src);
                        return $ocLazyLoad.load(files || netSrc || (globalTool.staticPath + src));
                    });
                });
                deferred.resolve();
                return promise;
            }]
        }
    },
    initApp: function(deps) { //初始化Angular
        window.myApp = angular.module('my-app', deps || []);
        myApp.run(['$rootScope', function(rootScope) { //添加公共变量
            rootScope.getImage = myCommon.getImage;
            rootScope.getPersonIcon = myCommon.getPersonIcon;
        }]);
        myApp.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function($controllerProvider, $compileProvider, $filterProvider, $provide) {
                myApp.controller = $controllerProvider.register;
                myApp.directive = $compileProvider.directive;
                myApp.filter = $filterProvider.register;
                myApp.factory = $provide.factory;
                myApp.service = $provide.service;
                myApp.value = $provide.value;
                myApp.constant = $provide.constant;
            }
        ]);
        //渲染完成后执行的事件
        myApp.directive('ngFinished', ['$timeout', function($timeout) {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    if (!scope[attr.ngFinished]) {
                        return;
                    }
                    if (scope.$last === true) {
                        setTimeout(scope[attr.ngFinished], 100); //Calling a scoped method
                    } else if (scope.$last === undefined) {
                        setTimeout(scope[attr.ngFinished], 100); //Calling a scoped method
                    }
                }
            };
        }]);
        //渲染html出错时使用
        myApp.filter('trustHtml', ['$sce', function($sce) {
            return function(input) {
                return $sce.trustAsHtml(input);
            }
        }]);
    }
}
