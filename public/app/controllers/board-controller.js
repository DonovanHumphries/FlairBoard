"use strict";

angular.module('flair').controller('flair.board', ['$scope', '$http', 'ServiceFactory', '$routeParams', '$compile', function ($scope, $http, ServiceFactory, $routeParams,$compile) {

    var service = ServiceFactory.GetDashboardService();
    var richTextService = ServiceFactory.GetRichTextService($routeParams.boardId);
    var todoListService = ServiceFactory.GetTodoListService($routeParams.boardId);
    var mindMapService = ServiceFactory.GetMindMapService($routeParams.boardId);

    $scope.currentBoard = {_id:$routeParams.boardId};

    $scope.flairs = {};

    $scope.flairs["fb-rich-text"] = {
        directive: "fb-rich-text",
        label: "Rich Text",
        width: 4,
        height: 6,
        service: richTextService
    };

    $scope.flairs["fb-todo"] = {
        directive: "fb-todo",
        label: "Todo List",
        width: 2,
        height: 4,
        service: todoListService
    };

    $scope.flairs["fb-mind-map"] = {
        directive: "fb-mind-map",
        label: "MindMap",
        width:8,
        height: 6,
        service: mindMapService
    };


    //TODO Move to directive (Could not find a good one online)
    var initializeGrid = function() {
        var options = {
            cell_height: 80,
            vertical_margin: 5,
            handle_class:"ibox-title"
        };

        var layoutGrid = $('.grid-stack');
        layoutGrid.gridstack(options);
        $scope.layoutGrid =layoutGrid.data('gridstack');

        if($scope.currentBoard.widgets)
        {
            for (var index = 0; index < $scope.currentBoard.widgets.length; index++) {
                var widget = $scope.currentBoard.widgets[index];
                widget.boardId=$scope.currentBoard._id;
                var html = generateHtml(widget);
                $scope.layoutGrid.add_widget(html, widget.x, widget.y, widget.width, widget.height, false);
            }
        }

        layoutGrid.on('change', function (e, items) {
            saveLayout(items);
        });
    };
    function generateHtml(widget)
    {
        //TODO move to template
        var div = '<div class="grid-stack-item"><div ' + widget.directive + ' class="grid-stack-item-content" ops="ops" remove="removeItem(item)" id="fbContainer" fbid="' + widget._id + '" boardId="' + widget.boardId + '"></div></div>';
        var html = $compile(div)($scope);
        return html;
    }

    var saveLayout = function (items) {

        if (items) {
            $scope.currentBoard.widgets  = [];
            for (var i = 0; i < items.length; i++) {
                var layoutItem = items[i];
                var props = parseProperties(layoutItem.el);
                var widget = {
                    x: layoutItem.x,
                    y: layoutItem.y,
                    height: layoutItem.height,
                    width: layoutItem.width,
                    _id:props._id,
                    directive:props.directive
                }
                // item did not save correctly/empty layout item so discard
                if(widget._id&&widget._id!=="undefined")
                    $scope.currentBoard.widgets.push(widget);
            }
        } else {
            //bug sometimes the items can be null when there are still items in the gird in this case dont save
            // hard to reproduce normally when deleting many items quickly
            // (workaround we could lock the UI when saving after delete)
            if ($scope.layoutGrid.grid.nodes.length > 0)
            {
                return;
            }
        }

        service.update($scope.currentBoard).then(function (result) {
        },function (err){
            $scope.showError("Error saving Board");
        });
    }

    var parseProperties = function (layoutItem) {

        var attributes = layoutItem[0].childNodes[0].attributes;
        var directive = attributes[0].name;
        var boardId = 0;
        var fbid = "";

        for (var i = 1; i < attributes.length; i++) {

            if (attributes[i].name === "fbid")
                fbid = attributes[i].value;

            if (attributes[i].name === "boardid")
                boardId = attributes[i].value;
        }

        return {
            directive: directive,
            boardId: boardId,
            _id: fbid
        }
    }
    
    $scope.removeItem=function(flair)
    {
        if(!flair)
            return;

        var items = $scope.layoutGrid.grid.nodes;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var layoutItem = items[i];
                var widget = parseProperties(layoutItem.el);
                if(widget._id===flair._id) {
                    var flair = $scope.flairs[widget.directive];
                    if (flair.service) {
                        flair.service.delete({_id: widget._id}).then(
                            function (result) {
                                $scope.layoutGrid.remove_widget(layoutItem.el, true)
                            }, function () {
                                $scope.showError("Error removing item");
                            }
                        );
                    }
                    break;
                }
            }
        }
    }

    $scope.createWidget= function(directive) {

        //add item to database and then adds it to the grid

        var flair = $scope.flairs[directive];

        if (flair.service) {
            flair.service.add({ name: flair.label }).then(function (result) {

                    var id = result.data;

                    var widget = {
                        directive: directive,
                        boardId: $routeParams.boardId,
                        _id: id
                    }

                    var html = generateHtml(widget);
                    $scope.layoutGrid.add_widget(html, 0, 0, flair.width, flair.height, true);

            },function(err){
                $scope.showError("Error Adding " + flair.label);
            });
        }
    }

    var refresh = function () {
        var result = service.get($scope.currentBoard._id);
        result.then(function(result) {
                if(result.data)
                    $scope.currentBoard = result.data[0];
                initializeGrid();
        },function(err)
        {
            $scope.showError("Error Loading Boards");
        });
    };

    refresh();
}]);
