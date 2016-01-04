var express = require('express');
var path = require('path');
var expressServer = express();
var gutil = require('gulp-util');
var connect = require('gulp-connect');
/**
 * Class for managing the Expres server
 * @property {number} portNum The port number to use for serving up the local project usually 2020
 * @property {string} url The URL for servering up the local project usually http://localhost/
 * @property {string} rootPath Root path for serving up the local files
 * @property {array} specificPaths Configurable array to allow custom url paths to lead to custom directories in or out of the current project
 */
var FabricServer = function() {
	this.portNum;
	this.url;
	this.rootPath;
	this.specificPaths = [
		{
			'urlPath': '/img',
			'folderPath': '../some/other/directory/img'
		}
	];
    /**
     * Set configuration for server
     * @param {number} portNum Project Port number usually 2020
     * @param {string} url Project URL usually http://localhost/ 
     * @param {string} rootPath Path to the local project
     * @return {null}
     */
	this.configServer = function(portNum, url, rootPath) {
		this.portNum = portNum;
		this.url = url;
		this.rootPath = rootPath;
        return;
	};
	/**
     * Set custom url paths to go to directories inside or out of project
     * @param {array} paths An array containing objects with the keys 'urlPath': '/someUrlPath', 'folderPath': 'C:\some\custom\folderlocation'
     * @return {null}
     */
	this.serveSpecificPaths = function(paths) {
		if(paths.length > 0) {
			this.specificPaths = paths;
		}
        return;
	};
	/**
     * Start the express server
     * @return {any} Returns express server
     */
	this.start = function() {
		// Check for any paths that are outside of the root server directory
		if(this.specificPaths.length > 0) {
			for(var i = 0; i < this.specificPaths.length; i++) {
                var pathJoined = path.join(this.rootPath, this.specificPaths[i].folderPath);
				expressServer.use(this.specificPaths[i].urlPath, express.static(pathJoined));
			}
		}
		
		// Serve up root APP director for express
        expressServer.use(express.static(path.join(this.rootPath)));
        return expressServer.listen(this.portNum);
	};
	
};

module.exports = new FabricServer();