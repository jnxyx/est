globalTool.initApp(['ngRoute', 'oc.lazyLoad']); //初始化Angular
myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/index/:id/', {
            templateUrl: globalTool.staticPath + 'tpl/index.html',
            resolve: globalTool.load(['/module/index.js'])
        })
        .otherwise({
            templateUrl: globalTool.staticPath + 'tpl/index.html',
            resolve: globalTool.load(['/module/index.js'])
        });
}]);
