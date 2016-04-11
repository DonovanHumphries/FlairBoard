angular.module("flair").directive('fbTodo',['ServiceFactory','toastr', function (ServiceFactory,toastr) {

    return {
        restrict: 'A',
        templateUrl: 'partials/todoList',
        scope: {
            remove: "&"
        },
        link: function($scope, iElement, attrs) {

            var boardId = attrs.boardid;
            var todoListId = attrs.fbid;
            var todoService = ServiceFactory.GetTodoListService(boardId);
            var todoItemService = ServiceFactory.GetTodoItemService(boardId, todoListId);

            $scope.TodoList = { id: todoListId, todoItems: new Array() }
            $scope.NewTodoItem = { label: "" }

            $scope.addItem = function() {
                if ($scope.NewTodoItem.label) {
                    $scope.NewTodoItem.priority = $scope.TodoList.todoItems.length;
                    todoItemService.add($scope.NewTodoItem).then(function (result) {
                            var newItem = angular.copy($scope.NewTodoItem);
                            newItem._id = result.data;
                            $scope.TodoList.todoItems.push(newItem);

                    },function (err){
                        toastr.error("Could not add Todo Item");
                    });
                }               
            };

            $scope.savetodoList = function() {
                todoService.update($scope.TodoList).then(function (result) {
                },function (err) {
                    toastr.error("Could not save Todo list");
                });
            };

            $scope.deleteTodoItem = function (itemToDelete) {
                todoItemService.delete(itemToDelete).then(function(result) {
                    for (var index=0;index< $scope.TodoList.todoItems.length;index++) {
                        var item = $scope.TodoList.todoItems[index];
                        if (itemToDelete._id === item._id) {
                            $scope.TodoList.todoItems.splice(index, 1);
                        }
                    }
                },function () {
                    toastr.error("Error deleting item");
                });
            }

            $scope.editItem = function (item) {
                item.editing = true;
            }

            $scope.doneEditing = function (item) {
                item.editing = false;
                todoItemService.update(item);
            };

            // this only occurs if the list is re-ordered
            var saveItems = function() {
                for (var index in $scope.TodoList.todoItems) {
                    var item = $scope.TodoList.todoItems[index];
                    if (index !== item.priority||item.todoFlairId!==todoListId) {
                        item.priority = index;
                        //Could have been dropped in from another todolist
                        item.todoFlairId = todoListId;
                        todoItemService.update(item);
                    }
                }  
            }

            $scope.sortableOptions = {
                stop: function (e, ui) {
                    saveItems();
                },
                update: function (e, ui) {
                    saveItems();
                },
                connectWith: ".todo-list",
                containment: 'document',
                helper: function (event, $item) {
                    var $helper = $('<ul class="todo-list m-t small-list" id="' + event.originalEvent.target.id + '">' + $item[0].outerHTML + '</ul>');
                    return $helper;
                },
                appendTo: 'body',
                zIndex: 10000,
                dropOnEmpty :true
            };

            $scope.deleteCompleted = function () {
                for (var index in $scope.TodoList.todoItems) {
                    var item = $scope.TodoList.todoItems[index];
                    if (item.isDone) {
                        $scope.deleteTodoItem(item);
                    }
                }
            };

            $scope.toggleDone=function(item)
            {
                item.isDone=!item.isDone;
                todoItemService.update(item);
            }

            var refresh = function() {
                todoService.get($scope.TodoList.id).then(function(result) {

                        $scope.TodoList = result.data;

                        if(!$scope.TodoList.todoItems)
                            $scope.TodoList.todoItems = [];

                        $scope.TodoList.todoItems.sort(function (a, b) {
                            return a.priority > b.priority;
                        });
                },function (err) {
                    toastr.error("Could not load Todo List");
                });
            }

            iElement.on('$destroy', function () {
            //Clean up
             });

            refresh();
        }
    }
   
}]);