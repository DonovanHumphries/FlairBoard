var Dashboard = require('../models/Board');

module.exports = function(){ 

    var createDashboard = function(board,userId)
    {
        var newBoard = new Dashboard(board);
        newBoard.owner=userId;

        newBoard.save(function(err) {
            if (err){
                console.log('Error in Saving newBoard: '+err);
                throw err;
            }
            return newBoard._id;
        });
    }
    var getDashboards = function(userId)
    {
        Dashboard.find({ 'owner' :  userId },
            function(err, boards) {
                if (err) {
                    console.log('Error in Saving newBoard: '+err);
                    throw err;
                }
              return boards;
            }
        );
    }
    var deleteDashboard = function(dashBoardId,userId)
    {

    }
    var updateDashboard = function(dashBoardId,userId)
    {

    }
    
    return {
        CreateDashboard:createDashboard,
        GetDashboards:getDashboards,
        DeleteDashboard:deleteDashboard,
        UpdateDashboard:updateDashboard
    }
}