myApp.controller('homeCtrl', ['$scope', '$rootScope', '$http', '$routeParams', function(scope, rootScope, http, routeParams) {
    var id = routeParams.id;
    scope.id = id;
}]);
