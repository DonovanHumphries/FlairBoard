"use strict";
angular.module('flair').controller('flair.dashboard', ['$scope','ServiceFactory', function ($scope,ServiceFactory) {
var service = ServiceFactory.GetDashboardService();

    service.getAll().then(function(result){
        $scope.boards= result.data;
    })

}]);