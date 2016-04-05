"use strict";
angular.module('flair').controller('flair.dashboard', ['$scope','ServiceFactory','$uibModal', function ($scope,ServiceFactory,$uibModal) {
var service = ServiceFactory.GetDashboardService();

    $scope.refresh = function () {
        var result = service.getAll();
        result.then(function(result) {
             $scope.boards = result.data;
        });
    };

    $scope.refresh();

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
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
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
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.saveBoard = function (board) {

        var result = board._id == null ? service.add(board) : service.update(board);
        result.then(function (result) {
            $scope.refresh();
        });
    };

    $scope.deleteBoard = function (board) {
        var result = service.delete(board);
        result.then(function (result) {
            if (result.success) {

                if ($routeParams.boardId == board.id)
                    $location.path("/");

                $scope.refresh();
            } else {
                alert("Error removing Board");
            }
        });
    };

}]);