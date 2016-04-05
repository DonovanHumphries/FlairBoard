module.exports.requiresLogin = function(req,res,next){
    if (!req.isAuthenticated()){
        res.redirect("/account/login");
    }
    else{
        next();
    }
}