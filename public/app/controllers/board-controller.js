"use strict";

angular.module('flair').controller('flair.board', ['$scope', '$http', 'ServiceFactory', '$routeParams', function ($scope, $http, ServiceFactory, $routeParams) {

    var service = ServiceFactory.GetDashboardService();

    $scope.currentBoard = {_id:$routeParams.boardId};

    $scope.flairs = new Object();

    $scope.flairs["fb-rich-text"] = {
        directive: "fb-rich-text",
        label: "Rich Text",
        width: 4,
        height: 6,
        service: {}
    };

    $scope.refresh = function () {
        var result = service.get($scope.currentBoard._id);
        result.then(function(result) {
                $scope.currentBoard = result.data[0];
        },function(err)
        {
            $scope.showError("Error Loading Boards");
        });
    };


    $scope.refresh();
}]);
