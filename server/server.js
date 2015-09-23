var express = require('express');
var path = require('path');
var localServer = express();
var gutil = require('gulp-util');

module.exports = {
    start: function(portNum, rootPath) {
        localServer.use('/css', express.static(path.join(rootPath, '../css')));
        localServer.use(express.static(path.join(rootPath)));
        return localServer.listen(portNum);
    }
};

