var Utilities = require('./Utilities');
var Plugins = require('./Plugins');
var Config = require('./Config');

/** Class for working adding banners to files */
var Banners = function() {
    /**
     * Retrieve Data for Banner
     * @returns {Object} containing pkg data, a Date object and an array of month names
     */
	this.getBannerData = function() {
		return {
			pkg : Plugins.pkg,
			date: new Date(),
			monthNames: Utilities.getMonths()
		}
	};
    /**
     * Retrieve Banner Template with Template Variables
     * @returns {String} with template variables for pkg version and pkg description
     */
	this.getBannerTemplate = function() {
		return ['/**',
					' * Office UI Fabric <%= pkg.version %>',
					' * <%= pkg.description %>',
					' **/',
      			''].join('\n');
	};
    /**
     * Retrieve Copyright Comment for Javascript
     * @returns {String} containing Javascript Comment Speicific Copyright Message
     */
	this.getJSCopyRight = function() {
		return '//' + Config.copyRightMessage +  "\r\n";
	};
    /**
     * Retrieve Copyright Comment for HTML
     * @returns {String} containing HTML Comment Speicific Copyright Message
     */
	this.getHTMLCopyRight = function() {
		return '<!-- ' +  Config.copyRightMessage  + ' -->' + "\r\n";
	};
    /**
     * Retrieve Copyright Comment for CSS
     * @returns {String} containing CSS Comment Speicific Copyright Message
     */
	this.getCSSCopyRight = function() {
		return '/* ' +  Config.copyRightMessage  + ' */' + "\r\n";
	};
};

module.exports = new Banners();