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
    
    this.getFilesByExtension = function(srcDir, extName) {
        try {
            var files = fs.readdirSync(srcDir);
            var filesWithExt = [];
            for(var i = 0; i < files.length; i++) {
                var currentFile = files[i];
                if(path.extname(currentFile) == extName) {
                    filesWithExt.push(currentFile);
                }
            }
            return filesWithExt;
        }
        catch(e) {
            return [];
        }
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
			return true; // We will return true if the directory doesnt exist
        }
	
		for( var i = 0; i < getSrcDir.length; i++) {
			var fileSrc = getSrcDir[i];
			var fileStatSrc = fs.statSync(srcDir + '/' + fileSrc);
			var fileDateSrc = fileStatSrc.mtime.getTime();
			srcDates.push(fileDateSrc);
		}
		
		for( var x = 0; x < getDistDir.length; x++) {
			var fileDist = getDistDir[x];
			var fileStatDist = fs.statSync(distDir + '/' + fileDist);
			var fileDateDist = fileStatDist.mtime.getTime();
			distDates.push(fileDateDist);
		}
		
		var maxSrcDate = Math.max.apply(null, srcDates);
		var maxDistDate = Math.max.apply(null, distDates);
	 
		if(maxSrcDate > maxDistDate) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = new Utilities();