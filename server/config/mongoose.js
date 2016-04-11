
var mongoose = require('mongoose');
var User = require('../models/User');

module.exports = function (config) {
    mongoose.connect(config.db)
    var db = mongoose.connection;
    db.on('error',console.error.bind(console,'connection error'));
    db.once('open',function callback(){ console.log('db opened');});

    //we use this user in development when no user logged in (handled in config/auth)
    if(process.env.NODE_ENV==='development') {
        var testUser = {
            _id: "5c936a10-ff8b-11e5-81c8-752b067f57c9",
            name: "Test user",
            email: "test@test.com",
            password: "$2a$10$K1FIulbIBdMs6C9QEGEz9.Df9mK7Tvyi8s47aGTgIfXS7sEGium5y",
            username: "test@test.com",
        }

        User.findOne({'_id':testUser._id},function(err, user) {
            if(!user)
            {
                var newUser = new User(testUser);
                newUser.save(function(err) {
                    if (err){
                        console.log('Error in Saving test user: '+err);
                        throw err;
                    }
                });
            }
        });
    }


};
