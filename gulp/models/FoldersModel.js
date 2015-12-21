var ObjectHelper = require('../modules/ObjectHelper');

var FoldersModel = function() {
	
	this.componentFolders = [];
	
	this.clearFolders = function() {
		this.componentFolder = [];
	}
	
	this.removeFolder = function(indexToRemove) {
		this.componentFolders.splice(indexToRemove, 1);
	}
	
	this.addFolder = function(folderName, modifiedTime) {
		this.componentFolders.push({
			'folderName': folderName,
			'modifiedTime': modifiedTime,
			"files": [] // Files get added seperately
		});
		return this.componentFolders.length - 1;
	}
	
	this.addFile = function(folderName, fileName, modifiedTime) {
		//Check if folder exists
		var folderIndex = this.getFolderIndex(this.componentFolders, folderName);
		if(folderIndex > -1) {
			this.componentFolders[folderIndex]["files"].push({
				fileName: fileName,
				modifiedTime: modifiedTime
			});
		} else {
			throw("The folder you are trying to add a file to does not exist, add the folder first");
		}
	}
	
	this.updateModifiedFileTime = function(folderName, fileName, modifiedTime) {
		var folderIndex = ObjectHelper.findIndexByKey(this.componentFolders, folderName);
		if(folderIndex > -1) {
			var files = this.componentFolders[folderIndex].files;
			var fileIndex = ObjectHelper.findIndexByKey(files, fileName);
			if(fileIndex > -1) {
				this.componentFolder[folderIndex]["files"][fileIndex].modifiedTime = modifiedTime;
			} else {
				throw("File doesnt exist");
			}
		} else {
			throw("Folder doesnt exist");
		}
	}
	
	this.updateModifiedFolderTime = function(folderName, modifiedTime) {
		var folderIndex = ObjectHelper.findIndexByKey(this.componentFolders, folderName);
		if(folderIndex > -1) {
			this.componentFolders[folderIndex].modifiedTime = modifiedTime;
		} else {
			throw("Folder doesnt exist");
		}
	}
	
	this.hasCatalogBeenCreated = function() {
		if(this.componentFolders.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	this.getFolderIndex = function(folderArray, folderName) {
		var index = -1;
		folderArray.some(function(entry, i) {
			if (entry.folderName == folderName) {
				index = i;
				return index;
			}
		});
		return index;
	}
	
	this.getFileIndex = function(folderArray, folderName, fileName) {
		
		var index = -1;
		var folder = this.getFolderIndex(folderArray, folderName);
		
		if(folder > -1) {
			
			var files = folderArray[folder]["files"];
			files.some(function(entry, i) {
				if (entry.fileName == fileName) {
					index = i;
					return index;
				}
			});
			
		} else {
			throw("Folder doesnt exist");
		}
		return index;
	}
}

module.exports = new FoldersModel();