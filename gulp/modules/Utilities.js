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
	
	this.getManifestFileList = function(fileArray, folderPath) {
		var newArray = [];
		
		if(typeof fileArray != "undefined" || fileArray != undefined) {
			newArray = fileArray.map(function(file, i) {
				return folderPath + '/' + file;
			});
			return newArray;
		} else {
			newArray.push(folderPath + '/*.html');
			return newArray;
		}
		
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
		
		var getSrcDir;
		var getDistDir;
		var distDates = [];
		var srcDates = [];
		
		try {
            getDistDir = fs.readdirSync(distDir);
			getSrcDir = fs.readdirSync(srcDir);
        }
        catch(e) {
			console.log(e);
			return true;
        }
	
		for( var i = 0; i < getSrcDir.length; i++) {
			
			var fileSrc = getSrcDir[i];
			var fileStatSrc = fs.statSync(srcDir + '/' + fileSrc);
			var fileDateSrc = new Date(fileStatSrc.mtime);
			srcDates.push(fileDateSrc.getTime());
			
		}
		
		for( var x = 0; x < getDistDir.length; x++) {
			
			var fileDist = getSrcDir[x];
			var fileStatDist = fs.statSync(srcDir + '/' + fileDist);
			var fileDateDist = new Date(fileStatDist.mtime);
			distDates.push(fileDateDist.getTime());
		}
		
		var maxSrcDate = Math.max.apply(null, srcDates);
		var maxDistDate = Math.max.apply(null, distDates);
		
		console.log(maxSrcDate, maxDistDate);
	
		if(maxSrcDate > maxDistDate) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = new Utilities();