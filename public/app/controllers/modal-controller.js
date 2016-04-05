"use strict";

angular.module('flair').controller('flair.modal', ['$scope', '$uibModalInstance', 'modalData', function ($scope, $uibModalInstance, modalData) {

    $scope.data = modalData;
    $scope.uibModalInstance = $uibModalInstance;

    $uibModalInstance.modalData = modalData;

    $scope.ok = function () {
        $uibModalInstance.close($scope.data);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
