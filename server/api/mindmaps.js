var express = require('express');
var MindMap = require('../models/MindMap');
var MindMapNode = require('../models/MindMapNode');

var mindmaps = express.Router();
var mapRepository = require('../repositories/genericRepositoryFactory')(MindMap);
var nodeRepository = require('../repositories/genericRepositoryFactory')(MindMapNode);

var error = function (err,res)
{
    //TODO extract out
    res.status(500);
    //only want to do this in development
    res.render('error', { error: err });
}

//stolen
function treeify(list) {
    var idAttr = '_id';
    var  parentAttr = 'parentId';
    var  childrenAttr = 'childNodes';

    var treeList = [];
    var lookup = {};
    list.forEach(function(obj) {
        lookup[obj[idAttr]] = obj;
        obj[childrenAttr] = [];
    });
    list.forEach(function(obj) {
        //TODO in this case we have orphans so we should remove them
        if (obj[parentAttr] != null) {
            if(obj[parentAttr] in lookup)
                lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
            treeList.push(obj);
        }
    });
    return treeList;
};

//TODO we use a separate query to get the nodes but this should return the full graph to be consistent  
mindmaps.get('/:mapId', function(req, res) {
    var mapId = req.params.mapId;
    mapRepository.GetEntity({_id:mapId}).then(function(result){
            res.json(result);
        },
        function(err){
            error(err,res);
        });
});

mindmaps.get('/', function(req, res) {
    var boardId = req.params.boardId;
    mapRepository.FindEntities({boardId:boardId}).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

mindmaps.post('/', function(req, res) {

    var boardId = req.params.boardId;
    req.body.boardId=boardId;

    mapRepository.CreateEntity(req.body).then(function(result){
            var rootNode = {
                mindMapId:result,
                label:"Start Here",
                left:100,
                right:100,
            }
            nodeRepository.CreateEntity(rootNode).then(function(itemsResult){
                res.json(result);
            },function(err){
                throw err;
            })
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

mindmaps.put('/', function(req, res) {
    var boardId = req.params.boardId;
    req.body.boardId=boardId;
    mapRepository.UpdateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

mindmaps.delete('/:mapId', function(req, res) {
    var mapId = req.params.mapId;
    mapRepository.DeleteEntity(mapId).then(function(result){
            if(result.success)
            {
                nodeRepository.DeleteEntities({mindMapId:mapId}).then(function(itemsResult){
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

mindmaps.get('/:mapId/nodes/:nodeId', function(req, res) {
    var nodeId = req.params.nodeId;
    nodeRepository.GetEntity({_id:nodeId}).then(function(result){
            res.json(result);
        },
        function(err){
            error(err,res);
        });
});
//shallow
mindmaps.get('/:mapId/nodes', function(req, res) {
    var mapId = req.params.mapId;
    nodeRepository.FindEntities({mindMapId:mapId}).then(function(result){
        var nodes =[];
        for(var i=0;i<result.length;i++)
        {
            var nodeObject = result[i].toObject();
            nodeObject.childNodes=[];
            nodes.push(nodeObject)
        }

        var tree = treeify(nodes);

        res.json(tree);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

mindmaps.post('/:mapId/nodes', function(req, res) {

    var mapId = req.params.mapId;
    req.body.mindMapId=mapId;

    nodeRepository.CreateEntity(req.body).then(function(result){

            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

mindmaps.put('/:mapId/nodes', function(req, res) {
    var mapId = req.params.mapId;
    req.body.todoListId=mapId;
    nodeRepository.UpdateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

mindmaps.delete('/:mapId/nodes/:nodeId', function(req, res) {
    var nodeId = req.params.nodeId;
    nodeRepository.DeleteEntity(nodeId).then(function(result){
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
    app.use('/api/boards/:boardId/mindmaps', mindmaps);
};