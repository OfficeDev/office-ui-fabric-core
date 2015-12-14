var utilities = require('./utilities');
var plugins = require('./plugins');

var Banners = function() {
	this.copyRightMessage = "Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.";
	
	this.getBannerData = function() {
		return {
			pkg : plugins.pkg,
			date: utilities.getDate(),
			monthNames: utilities.getMonths()
		}
	}
	
	this.getBannerTemplate = function() {
		return ['/**',
					' * Office UI Fabric <%= pkg.version %>',
					' * <%= pkg.description %>',
					' **/',
      			''].join('\n');
	}
	
	this.getJSCopyRight = function() {
		return '//' + this.copyRightMessage +  "\r\n";
	}
	
	this.getHTMLCopyRight = function() {
		return '<!-- ' +  this.copyRightMessage  + ' -->' + "\r\n";
	}
	
	this.getCSSCopyRight = function() {
		return '/* ' +  this.copyRightMessage  + ' */' + "\r\n";
	}
	
}

module.exports = new Banners();