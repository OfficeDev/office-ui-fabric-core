var fs = require('fs');
var config = require('./Config');
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
	
	this.getFileModifiedTime = function(file) {
		var fileStats = fs.statSync(file);
		return new Date(fileStats.mtime);
	}
	
	this.hasFileChangedInFolder = function(srcDir, distDir) {
		var getSrcDir = fs.statSync(srcDir);
		var getDistDir = fs.statSync(distDir);
		
		var srcDateTime = new Date(getSrcDir.mtime);
		var distDateTime = new Date(getDistDir.mtime);
		
		var dateList = [];
		
		fs.readdirSync(srcDir,function(err, files) {
			if (err) throw err;
			files.forEach(function(file){
				var curFile = fs.statSync(srcDir);
				dateList.push(new Date(curFile.mtime));
			});
		});

		if(srcDateTime.getTime() > distDateTime.getTime()) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = new Utilities();