angular.module("flair").directive('fbMindMapNode',['$compile','$timeout', function ($compile,$timeout) {

    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'partials/mindMapNodeTemplate',
        scope: { node: '=', service: "=" },
        link: function ($scope, element, attrs) {

            $scope.children = new Array();

            element.draggable({
                cursor: "move",
                drag: function() {
                    if ($scope.node.parentId)
                        DrawLineTo(this);
                },
                stop: function (event, ui) {
                    $scope.node.left= ui.position.left;
                    $scope.node.top= ui.position.top;
                    $scope.saveNode();
                }
            });

            element.find("#label").mouseenter(function () {
                $(".nodeOperations").hide();
                $(this).parent().parent().find(".nodeOperations").last().show();
            });

            $timeout(function() {
                $(element).find(".fbchild").each(function (index) {
                    DrawLineTo(this);
                });
            }, 0);

            //TODO work out how to do the nested directive/template in a ng-repeat for the child nodes
            //For now manual
            $scope.refresh = function() {

                if ($scope.node.childNodes) {
                    for (var i = 0; i < $scope.node.childNodes.length; i++) {
                        var child = GetNode($scope.node.childNodes[i]);

                        var lineContainer = $('<div id="lineconatiner" style="display: block;width: 1px;height: 1px;position: absolute;top:-17px;left:0px;color:grey">\
                                                 <div style="display: block;width: 1px;height: 1px">\
                                                    <svg id ="lineBox" class="bubble-connector" >\
                                                        <path id="line" d="M351,100C456,100,456,477,561,477" stroke="#18a689" stroke-width="5" fill="none" />\
                                                    </svg>\
                                                </div>\
                                            </div>');

                        lineContainer.append(child);
                        element.append(lineContainer);
                    }
                }
                drawNub(element);
            }

            $scope.editItem = function (item) {
                item.editing = true;
            }

            $scope.doneEditing = function (item) {
                item.editing = false;
                if (!item.label)
                    item.label = "Need validation for empty";

                $(element).find(".fbchild").each(function (index) {
                    DrawLineTo(this);
                });
                $scope.saveNode();
            }

            $scope.deleteNode = function () {

                if ($scope.node.parentId) {
                    $(element).parent().remove();

                    $scope.service.delete($scope.node).then(function(result) { $scope.refresh(); });
                }
            }

            function Node(top, left, label, parentId, mapId, id) {
                this._id = id;
                this.top = top;
                this.left = left;
                this.label = label;
                this.parentId = parentId;
                this.mindMapId = mapId;
                this.children = new Array();
                return this;
            }

            $scope.saveNode = function () {
                $scope.service.update($scope.node);
            }

            function addNode(creator) {
                var nub = $(creator);

                var newNode = new Node(creator.offsetTop, creator.offsetLeft, "New Item", $scope.node._id, $scope.node.mindMapId, null);

                $scope.service.add(newNode).then(function (result) {
                         newNode._id = result.data;
                        var childnode = GetNode(newNode);
                        var nubConatiner = nub.parent();
                        var nodeConatiner = nubConatiner.parent();
                        nubConatiner.remove();
                        nodeConatiner.append(childnode);
                        drawNub(element);
                }
                 );
            }

            function GetNode(newNode) {
                $scope.children[newNode._id] = newNode;
                var html = '<div  class="ng-cloak" service="service" node="children[' + "'" + newNode._id + "'" + ']" fb-mind-map-node></div>';
                return $($compile(html)($scope));
            }

            //TODO should be part of the template 
            function drawNub(node) {

                var html = '<div id="lineconatiner" style="display: block;width: 0px;height: 0px;position: relative;top:0px;left:0px;color:grey">\
                    <div style="display: block;width: 0px;height: 0px">\
                        <svg id ="lineBox" class="bubble-connector" >\
                            <path id="line" d="M351,100C456,100,456,477,561,477" stroke="#18a689"stroke-width="5" fill="none" />\
                        </svg>\
                    </div>\
                    <div class="nodeOperations" style="display: none;width: 40px;height: 0px;background:white;">\
                        <span ng-click="deleteNode()" id="delete" class="glyphicon glyphicon-remove" style="text-shadow: rgb(255, 255, 255) 0px 0px 3px;"></span>\
                        <span id="nub" class="glyphicon glyphicon-certificate" style="text-shadow: rgb(255, 255, 255) 0px 0px 3px;"></span>\
                    </div>\
                </div>';

                var nub = $($compile(html)($scope));
                nub.find("#nub").draggable({
                    start: function () {
                    },
                    drag: function () {
                        DrawLineTo(this);
                    },
                    stop: function () {
                        addNode(this);
                    }
                });
                node.append(nub);
            }

            //TODO yikes ugly but works (very fragile) clean up get rid of the parent stuff with nearest  
            function DrawLineTo(element) {

                var nub = $(element);
                var node = (element.tagName === "SPAN") ? nub.parent().parent().parent() : nub.parent().parent();
                var lineparent = (element.tagName === "SPAN") ? nub.parent().parent().children().first() : nub.parent().children().first();
                var lineBox = lineparent.children().first();
                var path = lineBox.children().first();

                var halfNodeLeft = (node.width() / 2) + node.offset().left;
                var halfNodeTop = (node.height() / 2) + node.offset().top;

                var nubTop = nub.offset().top;
                var nubLeft = nub.offset().left;
                var startx = 0;
                var starty = 0;
                var endx = 0;
                var endy = 0;

                var offsetstartx = 0;
                var offsetstarty = 0;
                var offsetendx = 0;
                var offsetendy = 0;

                //top left
                if (nubTop < halfNodeTop && nubLeft < halfNodeLeft) {
                    lineparent.offset({top: nubTop, left: nubLeft});

                    lineBox.width(Math.abs(halfNodeLeft - nubLeft));
                    lineBox.height(Math.abs(halfNodeTop - nubTop));

                    startx = 0;
                    starty = 0;
                    endx = lineBox.width();
                    endy = lineBox.height();

                    offsetstartx = endx / 2;
                    offsetstarty = starty;
                    offsetendx = endx / 2;
                    offsetendy = endy;
                }
                //bottom left
                if (nubTop > halfNodeTop && nubLeft < halfNodeLeft) {
                    lineparent.offset({top: halfNodeTop, left: nubLeft});

                    lineBox.width(Math.abs(halfNodeLeft - nubLeft));
                    lineBox.height(Math.abs(halfNodeTop - nubTop));

                    startx = lineBox.width();
                    starty = 0;
                    endx = 0;
                    endy = lineBox.height();

                    offsetstartx = startx / 2;
                    offsetstarty = starty;
                    offsetendx = startx / 2;
                    offsetendy = endy;
                }

                //bottom right
                if (nubTop > halfNodeTop && nubLeft > halfNodeLeft) {
                    lineparent.offset({top: halfNodeTop, left: halfNodeLeft});

                    lineBox.width(Math.abs(halfNodeLeft - nubLeft));
                    lineBox.height(Math.abs(halfNodeTop - nubTop));

                    startx = 0;
                    starty = 0;
                    endx = lineBox.width();
                    endy = lineBox.height();

                    offsetstartx = endx / 2;
                    offsetstarty = starty;
                    offsetendx = endx / 2;
                    offsetendy = endy;

                }
                //top right
                if (nubTop < halfNodeTop && nubLeft > halfNodeLeft) {

                    lineparent.offset({top: nubTop, left: halfNodeLeft});


                    lineBox.width(Math.abs(halfNodeLeft - nubLeft));
                    lineBox.height(Math.abs(halfNodeTop - nubTop));

                    startx = 0;
                    starty = lineBox.height();

                    endx = lineBox.width();
                    endy = 0;

                    offsetstartx = endx / 2;
                    offsetstarty = starty;
                    offsetendx = endx / 2;
                    offsetendy = endy;
                }


                path.attr('d', 'M' + startx + ',' + starty + ' C' + offsetstartx + ',' + offsetstarty + ' ' + offsetendx + ',' + offsetendy + ' ' + endx + ',' + endy);

            };

            $scope.refresh();
        }
    };
}]);