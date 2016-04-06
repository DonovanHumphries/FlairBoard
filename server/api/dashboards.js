var express = require('express');
var Dashboard = require('../models/Board');

var dashboards = express.Router();
var dashboardRepository = require('../repositories/genericRepositoryFactory')(Dashboard);

dashboards.get('/:boardId', function(req, res) {
    var boardId = req.params.boardId;
    dashboardRepository.FindEntities({_id:boardId}).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

dashboards.get('/', function(req, res) {
    var userId = req.user._id;
    dashboardRepository.FindEntities({owner:userId}).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

dashboards.post('/', function(req, res) {

    //don't trust the entity request has current user
    req.body.owner=req.user._id;

    dashboardRepository.CreateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

dashboards.put('/', function(req, res) {
    dashboardRepository.UpdateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

dashboards.delete('/:boardId', function(req, res) {
    var boardId = req.params.boardId;
    dashboardRepository.DeleteEntity(boardId).then(function(result){
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
    app.use('/api/boards', dashboards);
};