var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');

module.exports = function (app,config) {

    app.set('views', path.join(config.rootPath, 'server/views'));
    app.set('view engine', 'jade');

//app.use(favicon(path.join(config.rootPath, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.rootPath, 'public')));
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({secret:'Bloop Blarp'}));
    app.use(flash());
    
    //TODO move all the passport logic to auth
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    passport.use('login',new LocalStrategy({passReqToCallback : true},function (req, username, password, done) {
       User.findOne({ 'username' :  username },
                function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user&&isValidPassword(user, password)){
                        return done(null, user);
                    }
                    req.flash('message', "Invalid username or password");
                }
            );
    }));
    
    passport.use('register', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            var findOrCreateUser = function(){
                User.findOne({'username':username},function(err, user) {
                    
                    if (err){
                        return done(err);
                    }

                    if (user) {
                        return done(null, false,
                            req.flash('message','Username Already Exists'));
                    } else {
 
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = username;
                        newUser.name = req.param('name');
                        
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute
            // the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
     }));
};