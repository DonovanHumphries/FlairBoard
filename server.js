var express = require('express');

var app = express();
var env = process.env.NODE_ENV = process.env.NODE_ENV||'development';
var config = require('./server/config/config')[env]
require('./server/config/mongoose')(config);
require('./server/config/express')(app,config);
require('./server/config/routes')(app);
require('./server/api/dashboards')(app);
require('./server/api/richtexts')(app);

module.exports = app;





