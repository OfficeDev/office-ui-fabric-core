var fs = require('fs');
var config = require('./config');
var path = require('path');

var Utilities = function() {
	this.getDate = function() {
		return new Date();
	}
	
	this.getMonths = function() {
		return [
					"January", "February", "March",
					"April", "May", "June", "July",
					"August", "September", "October",
					"November", "December"
		];
	}
	this.parseManifest = function(folder) {
		return JSON.parse(fs.readFileSync(config.paths.componentsPath + '/' +  folder + '/' +  folder + '.json'));
	}
	this.getFolders = function(dir) {
		 return fs.readdirSync(dir).filter(function(file) {
					return fs.statSync(path.join(dir, file)).isDirectory();
				});
	}
}

module.exports = new Utilities();