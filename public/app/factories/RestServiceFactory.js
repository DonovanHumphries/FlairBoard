
var serviceFactory = function ($http, $q) {

    var RestServiceCalls = function ($http, $q, baseurl) {
        var operations = {
            get: function (id) {
               return $http.get(baseurl + "/" + id)
            },

            getAll: function () {
                return $http.get(baseurl);
            },

            add: function (entity) {
                return   $http.post(baseurl, entity);
            },

            update: function (entity) {
                return $http.put(baseurl, entity);
            },

            delete: function (entity) {
                return $http.delete(baseurl + "/" + entity._id);
            },
        };
        return operations;
    };

    var factory = {
        GetDashboardService : function() {
            return RestServiceCalls($http, $q, "api/boards");
        },
        GetRichTextService : function(boardId) {
            return RestServiceCalls($http, $q, "api/boards/"+boardId+"/richtexts");
        },
        GetTodoListService : function(boardId) {
            return RestServiceCalls($http, $q, "api/boards/"+boardId+"/todolists");
        },
        GetTodoItemService : function(boardId, todoListId) {
            return RestServiceCalls($http, $q, "api/boards/"+boardId+ "/todolists/" + todoListId + "/items");
        },
        GetMindMapService : function(boardId) {
            return RestServiceCalls($http, $q, "api/boards/"+boardId+"/mindmaps");
        },
        GetMindMapNodeService : function(boardId, mindMapId) {
            return RestServiceCalls($http, $q, "api/boards/"+boardId+ "/mindmaps/" + mindMapId + "/nodes");
        },
    }
    return factory;
};


serviceFactory.$inject = ['$http', '$q'];