var fs = require('fs');
var path = require('path');
var colors = require('colors/safe');
/**
 * Class to help format messages for the console
 */
var ConsoleHelper = function() {
    /**
     * Generate a success message for the console
     * @param {string} message Success message to be printed to the console
     * @param {boolean} showTip Whether or not to show a "tip" message to the user
     */
	this.generateSuccess = function(message, showTip) {
		var spacing = "\r\n";
		var tipsMessage = "";
		var spaceDashes = colors.rainbow("---------------------------------------------------");
		if (showTip === true) {
			tipsMessage = colors.gray("TIP: To test changes to Fabric source, check under /samples for demo HTML files of each Component.") + spacing;
		}
		var consoleText = colors.green("Fabric Message: ") + colors.cyan(message);
		var completeMessage = spaceDashes + spacing + spacing + consoleText + spacing + tipsMessage + spacing + spaceDashes;
		return completeMessage;
	};
};

module.exports = new ConsoleHelper();