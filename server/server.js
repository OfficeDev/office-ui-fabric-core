var express = require('express');
var path = require('path');
var localServer = express();
var gutil = require('gulp-util');
var rootPath = path.resolve(__dirname, '..');
var browserSync = require('browser-sync').create();

module.exports = {
    start: function(portNum) {
        localServer.use('/img', express.static(path.join(rootPath, 'img')));
        localServer.use('/ext', express.static(path.join(rootPath, 'ext')));
        localServer.use('/components', express.static(path.join(rootPath, 'components')));
        localServer.use(express.static(path.join(rootPath, 'app')));
        return localServer.listen(portNum);
    },
    startBSync: function(portNum) {
	    return browserSync.init({
	        server: {
	            baseDir: path.join(rootPath, 'app'),
	            routes: {
			        '/img': path.join(rootPath, 'img'),
			        '/ext': path.join(rootPath, 'ext'),
			        '/components': path.join(rootPath, 'components')
			    }
	        },
	        port: portNum,
	        browser: ["google chrome", "firefox"],
	        ghostMode: false
	    });
    },
    reload: function() {
    	browserSync.reload();
    }
};

