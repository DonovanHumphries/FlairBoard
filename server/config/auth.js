module.exports.requiresLogin = function(req,res,next){
    if (!req.isAuthenticated()){

        if(process.env.NODE_ENV==='development')
        {
            var user = {_id:"5c936a10-ff8b-11e5-81c8-752b067f57c9",name:"Test User"};
            req.logIn(user,function(err)
            {
                if(!req.isAuthenticated())
                    res.redirect("/account/login");
                else
                    next();
            });
        }
        else
        {
            res.redirect("/account/login");
        }

    }
    else{
        next();
    }
}