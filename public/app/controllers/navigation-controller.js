"use strict";
angular.module('flair').controller('flair.navigation', ['$scope','ServiceFactory','$uibModal', function ($scope,ServiceFactory,$uibModal) {
var service = ServiceFactory.GetDashboardService();

    var refresh = function () {
        var result = service.getAll();
        result.then(function(result) {
             $scope.boards = result.data;
        },function(err){
            $scope.showError("Error loading boards");
        });
    };

    refresh();

    $scope.showError = function (errorMessage) {
        //TODO implement toaster
        alert(errorMessage);
    }

    $scope.newBoard = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'partials/boardModal',
            controller: 'flair.modal',
            resolve: {
                modalData: function() {
                    return {};
                }
            }
        });

        modalInstance.result.then(function (data) {
            $scope.saveBoard(data);
        });

    }

    $scope.editBoard = function (board) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'partials/boardModal',
            controller: 'flair.modal',
            resolve: {
                modalData: function () {
                    return angular.copy(board);
                }
            }
        });

        modalInstance.result.then(function (data) {
            $scope.saveBoard(data);
        });
    }

    $scope.saveBoard = function (board) {
        var result = board._id == null ? service.add(board) : service.update(board);
        result.then(function (result) {
            //TODO we can maintain local state, no reed to reload all
           refresh();
        },function(err){
            $scope.showError("Error saving board");
        });
    };

    $scope.deleteBoard = function (board) {
        var result = service.delete(board);
        result.then(function (result) {
            //TODO we can maintain local state, no reed to reload all
           refresh();
        },function(err){
            $scope.showError("Error removing board");
        });
    };

}]);