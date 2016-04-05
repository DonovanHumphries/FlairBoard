var path = require('path');
var rootPath= path.normalize(__dirname+'/../../')

module.exports = {
    development:{
        db:'mongodb://localhost/flair',
        rootPath:rootPath,
        port: process.env.PORT || 80
    },
    production:{
        db:'mongodb://FlairUser:flair@ds976.mongolab.com:53178/flair',
        rootPath:rootPath,
        port: process.env.PORT || 80
    }
}