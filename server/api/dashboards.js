var express = require('express');
//serves static landing page (public)
var dashboards = express.Router();
var dashboardDomainManager = require('../domainManagers/dashboardDomainManager')();

function OK(res){
    sendJson({success:true})
}

function sendJson(res,obj){
    res.setHeader('Content-Type', 'application/json');
    var data  = {data:obj};
    res.send(JSON.stringify(data));
}

dashboards.get('/', function(req, res) {
    var userId = req.user._id;
    sendJson(res,dashboardDomainManager.GetDashboards(userId));
});

dashboards.put('/', function(req, res) {
    sendJson(res,dashboardDomainManager.CreateDashboard(req.body));
});

dashboards.post('/', function(req, res) {
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