var express = require('express');
var passport = require('passport');
var auth= require('../config/auth')

//TODO if this file gets too big split out by route

//serves static landing page (public)
var home = express.Router();
home.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

//handles all user/security operations (public)
var account = express.Router();
account.get('/', function(req, res) {
    res.redirect('/account/login');
});

account.get('/login', function(req, res) {
    res.render('login',{ message: req.flash('message') });
});

account.post('/login', passport.authenticate('login', {
    successRedirect: '/dashboards',
    failureRedirect: '/account/login',
    failureFlash : true
}));

account.get('/register', function(req, res) {
    res.render('register',{message: req.flash('message')});
});

account.post('/register', passport.authenticate('register', {
    successRedirect: '/dashboards',
    failureRedirect: '/account/register',
    failureFlash : true
}));

account.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})

//serves the angular app and partials (must be authenticated)
var dashboard = express.Router();
dashboard.get('/', auth.requiresLogin, function(req, res) {
    res.render('dashboards');
});

module.exports = function (app) {
    app.use('/', home);
    app.use('/dashboards', dashboard);
    app.use('/account', account);
}
