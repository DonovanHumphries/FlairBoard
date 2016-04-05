var Dashboard = require('../models/Board');

module.exports = function(){

    var createDashboard = function(board,userId,res)
    {

        board.owner=userId;
        var newBoard = new Dashboard(board);


        newBoard.save(function(err) {
            if (err){
                console.log('Error in Saving newBoard: '+err);
                res.json(err);
            }
            res.json(newBoard._id);
        });
    }
    var getDashboards = function(userId,res)
    {
        Dashboard.find({ 'owner' :  userId },
            function(err, boards) {
                if (err) {
                    console.log('Error in Saving newBoard: '+err);
                    throw err;
                }
                res.json(boards);
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
}()