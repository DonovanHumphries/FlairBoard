var express = require('express');
var RichText = require('../models/RichText');

var richtexts = express.Router();
var textRepository = require('../repositories/genericRepositoryFactory')(RichText);

richtexts.get('/:richtextId', function(req, res) {
    var richtextId = req.params.richtextId;
    textRepository.FindEntities({_id:richtextId}).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

richtexts.get('/', function(req, res) {
    var boardId = req.params.boardId;
    textRepository.FindEntities({boardId:boardId}).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

richtexts.post('/', function(req, res) {

    var boardId = req.params.boardId;
    req.body.boardId=boardId;

    textRepository.CreateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

richtexts.put('/', function(req, res) {
    var boardId = req.params.boardId;
    req.body.boardId=boardId;
    textRepository.UpdateEntity(req.body).then(function(result){
            res.json(result);
        },
        function(err){
            //TODO extract out
            res.status(500);
            //only want to do this in development
            res.render('error', { error: err });
        });
});

richtexts.delete('/:richtextId', function(req, res) {
    var richtextId = req.params.richtextId;
    textRepository.DeleteEntity(richtextId).then(function(result){
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
    app.use('/api/boards/:boardId/richtexts', richtexts);
};