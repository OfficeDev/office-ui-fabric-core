var path = require('path');
var gulputil = require('gulp-util');
/**
 * Custom Error Handling Class for Various Tasks
 */
var ErrorHandling = function() {
    /**
     * Generic error handler for errors in the Pipe
     * @param {any} error Error message
     */
	this.onErrorInPipe = function(error) {
		 console.log(error);
    };
};

module.exports = new ErrorHandling();