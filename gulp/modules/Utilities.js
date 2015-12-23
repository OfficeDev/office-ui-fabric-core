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
            if(extName.length > 0) {
                for(var i = 0; i < files.length; i++) {
                    var currentFile = files[i];
                    if(path.extname(currentFile) == extName) {
                        filesWithExt.push(currentFile);
                    }
                }
                return filesWithExt;
            }
            return files;
        }
        catch(e) {
            return [];
        }
    }
    
    this.getFilesDates = function(files, filePath) {
        var fileDates = [];
        for( var i = 0; i < files.length; i++) {
			var fileSrc = files[i];
			var fileStatSrc = fs.statSync(filePath + '/' + fileSrc);
			var fileDateSrc = fileStatSrc.mtime.getTime();
			fileDates.push(fileDateSrc);
		}
        return fileDates;
    }
	
	this.hasFileChangedInFolder = function(srcDir, distDir, extension) {
		var getSrcDir;
		var getDistDir;
		var distDates = [];
		var srcDates = [];
        var maxSrcDate = 0;
        var maxDistDate = 0;
		
		try {
            getDistDir = this.getFilesByExtension(distDir);
			getSrcDir = this.getFilesByExtension(srcDir);
        }
        catch(e) {
			return true; // We will return true if the directory doesnt exist
        }
	   
        srcDates = this.getFilesDates(getSrcDir, srcDir);
        distDates = this.getFilesDates(getDistDir, distDir);
        
		// for( var i = 0; i < getSrcDir.length; i++) {
		// 	var fileSrc = getSrcDir[i];
		// 	var fileStatSrc = fs.statSync(srcDir + '/' + fileSrc);
		// 	var fileDateSrc = fileStatSrc.mtime.getTime();
		// 	srcDates.push(fileDateSrc);
		// }
		
		// for( var x = 0; x < getDistDir.length; x++) {
		// 	var fileDist = getDistDir[x];
		// 	var fileStatDist = fs.statSync(distDir + '/' + fileDist);
		// 	var fileDateDist = fileStatDist.mtime.getTime();
		// 	distDates.push(fileDateDist);
		// }
		
		maxSrcDate = Math.max.apply(null, srcDates);
		maxDistDate = Math.max.apply(null, distDates);
	 
		if(maxSrcDate > maxDistDate) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = new Utilities();