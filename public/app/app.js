var app = angular.module('flair', ['ngRoute', 'ngAnimate', 'ui.bootstrap','gridstack-angular','ui.sortable','toastr']);

var configFunction = function ($routeProvider, $httpProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'partials/welcome'
    }).
    when('/board/:boardId', {
        templateUrl: function (params) { return 'partials/board?id=' + params.boardId; }
    }).otherwise({
        redirectTo: '/'
    });
    
    //Ensure that we are a authenticated user else push back to login page
    //Not really required as the routing on the server takes care of this
    $httpProvider.interceptors.push('AuthHttpResponseInterceptor');
};
app.factory('AuthHttpResponseInterceptor', AuthHttpResponseInterceptor);
app.factory('ServiceFactory', serviceFactory);

configFunction.$inject = ['$routeProvider', '$httpProvider'];

app.config(configFunction);