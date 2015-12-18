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
		var folderIndex = ObjectHelper.findIndexByKey(folderName);
		if(folderIndex > -1) {
			this.componentFolders[folderIndex]["files"] = [];
		} else {
			var lastFolderIndex = this.addFolder(folderName, '');
			this.componenFolders[lastFolderIndex]["files"].push({
				"fileName":fileName,
				"modifiedTime": fileName
			});
		}
	}
	this.updateModifiedFileTime = function(folderName, fileName, modifiedTime) {
		
	}
	this.updateModifiedFolderTime = function(folderName, modifiedTime) {
		var folderIndex = ObjectHelper.findIndexByKey(this.componentFolders, folderName);
		if(folderIndex > -1) {
			this.componentFolders[folderIndex].modifiedTime = modifiedTime;
		} else {
			throw("Folder doesnt exist");
		}
	}
}

module.exports = new FoldersModel();