var Plugins = require('./Plugins');
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
		var spaceDashes = Plugins.colors.rainbow("---------------------------------------------------");
		var consoleText = Plugins.colors.green("Fabric Message: ") + Plugins.colors.cyan(message);
		var completeMessage = spaceDashes + spacing + spacing + consoleText + spacing + tipsMessage + spacing + spaceDashes;
		return completeMessage;
	};
};

module.exports = new ConsoleHelper();