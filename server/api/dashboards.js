var express = require('express');
//serves static landing page (public)
var dashboards = express.Router();
var dashboardDomainManager = require('../domainManagers/dashboardDomainManager');

dashboards.get('/', function(req, res) {
    var userId = "abbd8dd0-fafb-11e5-ba15-03fb119882f7";
    dashboardDomainManager.GetDashboards(userId,res);
});

dashboards.post('/', function(req, res) {
    var userId = "abbd8dd0-fafb-11e5-ba15-03fb119882f7";
    dashboardDomainManager.CreateDashboard(req.body,userId,res);
});

dashboards.put('/', function(req, res) {
    dashboardDomainManager.UpdateDashboard(req.body)
    OK(res);
});

dashboards.delete('/:boardId', function(req, res) {
    var boardId = req.params.boardId;
    var userId = req.user._id;
    dashboardDomainManager.DeleteDashboard(boardId,userId)
    OK(res);    
});

module.exports = function (app) {
    app.use('/api/boards', dashboards);
}