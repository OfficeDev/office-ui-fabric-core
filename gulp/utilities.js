var fs = require('fs');
var fs = require('fs');

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
	this.parseManifest = function() {
		return JSON.parse(fs.readFileSync(config.paths.componentsPath + '/' +  folder + '/' +  folder + '.json'));
	}
}

module.exports = new Utilities();