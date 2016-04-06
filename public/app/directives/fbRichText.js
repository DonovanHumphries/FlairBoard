//TODO https://github.com/summernote/angular-summernote

angular.module("flair").directive('fbRichText',['$compile', '$uibModal','ServiceFactory', function ($compile, $uibModal, ServiceFactory) {

    return {
        restrict: 'A',
        templateUrl: 'partials/richtext',
        scope: {remove:'&'},
        link: function($scope, iElement, attrs) {

            var boardId = attrs.boardid;
            var richTextId = attrs.fbid;
            $scope.item = { _id: richTextId }
            $scope.RichTextFlair = { _id: richTextId }
            var richTextService = ServiceFactory.GetRichTextService(boardId);
            $scope.edit = function() {
                $(iElement).find('.summernote').summernote({
                    focus: true,
                    toolbar: [
                                ['style', ['style']],
                                ['font', ['bold', 'italic', 'underline', 'clear']],
                                ['fontname', ['fontname']],
                                ['color', ['color']],
                                ['para', ['ul', 'ol', 'paragraph']],
                                ['height', ['height']],
                                ['table', ['table']]
          
                    ]
                });
            };
            $scope.save = function() {
                var aHTML = $(iElement).find('.summernote').code();

                if ($scope.RichTextFlair.text !== aHTML) {
                    $scope.RichTextFlair.text = aHTML;
                    richTextService.update($scope.RichTextFlair).then(function(result) {
                    },function(){$scope.showError("Error saving text");});
                }

                iElement.find('.summernote').destroy();

            };
            $scope.refresh = function() {
                richTextService.get(richTextId).then(function(result) {
                    if(result.data.length) {
                        $scope.RichTextFlair = result.data[0];
                        iElement.find('.summernote').destroy();
                        iElement.find('.summernote').html($scope.RichTextFlair.text);
                    }
                });
            }

            $scope.refresh();

            iElement.mouseenter(function () {

                $scope.edit();
            });

            iElement.mouseleave(function () {
                $scope.save();
            });

           
        }
    }

}]);