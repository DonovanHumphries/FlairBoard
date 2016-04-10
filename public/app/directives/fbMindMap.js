angular.module("flair").directive('fbMindMap', ['ServiceFactory','toastr', function (ServiceFactory,toastr) {

    return {
        restrict: 'A',
        templateUrl: 'partials/mindMap',
        scope:{remove:"&"},
        link: function ($scope, iElement, attrs) {

            var boardId = attrs.boardid;
            var mindMapId = attrs.fbid;
            //var mindMapService = serviceFactory.GetMindMapService(boardId);
            $scope.mindMapNodeService = ServiceFactory.GetMindMapNodeService(boardId, mindMapId);
           
            $scope.zoom = 1;
            $scope.MindMap = {_id:mindMapId};

            $scope.decreaseZoom = function () {
                $scope.zoom += $scope.zoom * 0.1;
            };

            $scope.increaseZoom = function () {
                $scope.zoom -= $scope.zoom * 0.1;
            };

            $scope.refresh = function() {
                $scope.mindMapNodeService.getAll().then(function (result) {
                        $scope.mindMapRootNodes = result.data;
                },function (err) {
                    toastr.error("Could not load Mind Map");
                });
            };
            $scope.refresh();
        }
    }
}]);