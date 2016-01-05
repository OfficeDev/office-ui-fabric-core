var fs = require('fs');
var Config = require('./Config');
var path = require('path');

/**
 * Helpful assortment of Utilites used throughout the build
 */
var Utilities = function() {
	/**
     * Retrieves all months
     * @returns {array} An array with the month names as strings
     */
	this.getMonths = function() {
		return [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
		];
	};
	/**
     * Process and return the list of files for the component either by whats in the directory or what's listed in the manifest
     * @param {array} fileArray     An array with just file names
     * @param {string} folderPath   A string containing the path to where the files are located.
     * @returns {array}              Returns an array containing new list and order for files  
     */
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
	};
	/**
     * Parse a specific component's manifest (JSON) file
     * @param {string}  jsonFileLocation string containing the path to folder/file of the JSON manifest
     * @returns {object} Object Containing the manifest data in an object 
     */
	this.parseManifest = function(jsonFileLocation) {
        var manifest = fs.readFileSync(jsonFileLocation);
        return JSON.parse(manifest.toString());
	};
	/**
     * Return an array of folders from specified directory without files
     * @param {string} dir  Path to directory
     * @returns {array}      Returns an array of folders within an folder wihout files
     */
	this.getFolders = function(dir) {
        try {
            var folders = fs.readdirSync(dir).filter(function(file) {
                            return fs.statSync(path.join(dir, file)).isDirectory();
                        });
            return folders;
        }
        catch(e) {
            return [];
        }
    };
    /**
     * Return an Array of files inside a directory by extension name
     * @param {string} srcDir   The src directory path
     * @param {string} extName  The filename extension somtimes .less or .css
     * @returns {array}          Returns an Array of filenames    
     */
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
    };
    /**
     * Returns an array of each file in the array given
     * @param {array}   files An array of files needing dates
     * @param {string}  filePath Base path to each file given in the array
     * @returns {array} Returns an array with all file dates
     */
    this.getFilesDates = function(files, filePath) {
        var fileDates = [];
        for( var i = 0; i < files.length; i++) {
			var fileSrc = files[i];
			var fileStatSrc = fs.statSync(filePath + '/' + fileSrc);
			var fileDateSrc = fileStatSrc.mtime.getTime();
			fileDates.push(fileDateSrc);
		}
        return fileDates;
    };
	/**
     * Check if a source directory is newer than the dist directory
     * @param {string} srcDir The working source directory
     * @param {string} distDir The compiled distributed directory
     * @param {string} srcExtension Optional source extension if you want to only compare certain files
     * @param {string} distExtension Option dist extension if you want to compare certain files, needs dist and src extensions
     */
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
			return true; // We will return true if the directory doesn't exist
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
	};
};

module.exports = new Utilities();