var express = require('express');
var path = require('path');
var expressServer = express();
var gutil = require('gulp-util');

var FabricServer = function() {
	
	this.portNum;
	this.url;
	this.rootPath;
	
	// Example of how to pass in specific paths
	this.specificPaths = [
		{
			'urlPath': '/img',
			'folderPath': '../some/other/directory/img'
		}
	];
	
	this.configServer = function(portNum, url, rootPath) {
		this.portNum = portNum;
		this.url = url;
		this.rootPath = rootPath;
	}
	
	/*
	 This accepts paths to be served up for example:
	 if you want http://localhost:1234/img/ to be active but /img is actually located outside of your app 
	 directory then use this to set an alias for that directory
	*/
	
	this.serveSpecificPaths = function(paths) {
		if(paths.length > 0) {
			this.specificPaths = paths;
		}
	}
	
	this.start = function() {
		
		expressServer.configure(function() {
			expressServer.use(function(err, req, res, next) {
				res.status(500);
				res.render('error', { error: err });
			});
		});
		
		// Check for any paths that are outside of the root serve directory
		if(this.specificPaths.length > 0){
			for(var i = 0; i < this.specificPaths; i++) {
				expressServer.use(this.specificPaths[i].urlPath, express.static(path.join(this.rootPath, this.specificPaths[i].folderPath)));
			}
		}
		
		// Serve up root APP director for express
        expressServer.use(express.static(path.join(this.rootPath)));
		
        return expressServer.listen(this.portNum);
	}
	
}

module.exports = new FabricServer();