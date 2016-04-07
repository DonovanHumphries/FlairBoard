var path = require('path');
var rootPath= path.normalize(__dirname+'/../../')

module.exports = {
    development:{
        db:'mongodb://localhost/flair',
        rootPath:rootPath,
        port: process.env.PORT || 80
    },
    production:{
        db:'mongodb://FlairUser:<password>@ds023108.mlab.com:23108/flair',
        rootPath:rootPath,
        port: process.env.PORT || 80
    }
}