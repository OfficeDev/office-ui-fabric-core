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
    
    this.getFilesByExtension = function(srcDir, extName) {
        try {
            var files = fs.readdirSync(srcDir);
            if(extName.length > 0) {
            	var filesWithExt = [];
                for(var i = 0; i < files.length; i++) {
                    var currentFile = files[i];
                    if(path.extname(currentFile) == extName) {
                        filesWithExt.push(currentFile);
                    }
                }
                return filesWithExt;
            } else {
            	return files;
			}
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
	
	this.hasFileChangedInFolder = function(srcDir, distDir, srcExtension, distExtension) {
		var getSrcDir;
		var getDistDir;
		var distDates = [];
		var srcDates = [];
        var maxSrcDate = 0;
        var maxDistDate = 0;
		
		if(distExtension == undefined) {
			distExtension = srcExtension;
		}
		
		try {
			getDistDir = this.getFilesByExtension(distDir, distExtension);
			getSrcDir = this.getFilesByExtension(srcDir, srcExtension);
        }
        catch(e) {
			return true; // We will return true if the directory doesnt exist
        }
	   
        srcDates = this.getFilesDates(getSrcDir, srcDir);
        distDates = this.getFilesDates(getDistDir, distDir);
		
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