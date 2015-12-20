var ObjectHelper = require('../modules/ObjectHelper');

var FoldersModel = function() {
	
	this.componentFolders = [];
	
	this.addFolder = function(folderName, modifiedTime) {
		this.componentFolders.push({
			'folderName': folderName,
			'modifiedTime': modifiedTime,
			"files": [] // Files get added seperately
		});
		return this.componentFolders.length - 1;
	}
	
	this.addFile = function(folderName, fileName, modifiedTime) {
		var folderIndex = ObjectHelper.findIndexByKey(this.componentFolders, folderName);
		console.log(folderIndex);
		if(folderIndex > -1) {
			this.componentFolders[folderIndex]["files"] = [];
			console.log("found folder");
		} else {
			console.log("Didnt find folder");
			var lastFolderIndex = this.addFolder(folderName, '');
			this.componentFolders[lastFolderIndex]["files"].push({
				"fileName":fileName,
				"modifiedTime": modifiedTime
			});
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
	
	this.isThereFolders = function() {
		if(this.componentFolders.length > 0) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = new FoldersModel();