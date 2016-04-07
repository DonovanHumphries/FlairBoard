var express = require('express');
var TodoList = require('../models/TodoList');
var TodoItem = require('../models/TodoItem');

var todos = express.Router();
var listRepository = require('../repositories/genericRepositoryFactory')(TodoList);
var itemRepository = require('../repositories/genericRepositoryFactory')(TodoItem);

var error = function (err,res)
{
    //TODO extract out
    res.status(500);
    //only want to do this in development
    res.render('error', { error: err });
}

//deep
todos.get('/:listId', function(req, res) {
    var listId = req.params.listId;
    listRepository.GetEntity({_id:listId}).then(function(listResult){
        //TODO need to look into the best way to do this in mongo as we want to update single todoitems
        itemRepository.FindEntities({todoListId:listResult._id}).then(function(itemsResult){
            var list = listResult.toObject();
            list.todoItems=[];
            for(var i=0;i < itemsResult.length;i++)
            {
                list.todoItems.push(itemsResult[i].toObject());
            }
            //list.todoItems=itemsResult;
            res.json(list);
            },function(err){
            throw err;
        })
        },
        function(err){
            error(err,res);
        });
});
//shallow
todos.get('/', function(req, res) {
    var boardId = req.params.boardId;
    listRepository.FindEntities({boardId:boardId}).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

todos.post('/', function(req, res) {

    var boardId = req.params.boardId;
    req.body.boardId=boardId;

    listRepository.CreateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

todos.put('/', function(req, res) {
    var boardId = req.params.boardId;
    req.body.boardId=boardId;
    listRepository.UpdateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

todos.delete('/:listId', function(req, res) {
    var listId = req.params.listId;
    listRepository.DeleteEntity(listId).then(function(result){
            if(result.success)
            {
                itemRepository.DeleteEntities({todoListId:listId}).then(function(itemsResult){
                    res.json(itemsResult);
                },function(err){
                    throw err;
                })
            }
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});
//Items

todos.get('/:listId/items/:itemId', function(req, res) {
    var listId = req.params.listId;
    itemRepository.GetEntity({_id:listId}).then(function(result){
            res.json(result);
        },
        function(err){
            error(err,res);
        });
});
//shallow
todos.get('/:listId/items', function(req, res) {
    var listId = req.params.listId;
    itemRepository.FindEntities({todoListId:listId}).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

todos.post('/:listId/items', function(req, res) {

    var listId = req.params.listId;
    req.body.todoListId=listId;

    itemRepository.CreateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

todos.put('/:listId/items', function(req, res) {
    var listId = req.params.listId;
    req.body.todoListId=listId;
    itemRepository.UpdateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

todos.delete('/:listId/items/:itemId', function(req, res) {
    var listId = req.params.listId;
    itemRepository.DeleteEntity(listId).then(function(result){
         res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

module.exports = function (app) {
    app.use('/api/boards/:boardId/todoLists', todos);
};