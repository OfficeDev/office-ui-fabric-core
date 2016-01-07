var path = require('path');
var gulputil = require('gulp-util');
var map = require('map-stream');
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
    this.JSHintErrors = map(function (file, cb) {
    
        if (!file.jshint.success) {
            console.log('JSHINT fail in '+file.path);
            file.jshint.results.forEach(function (err) {
                if (err) {
                    var error = err.error;
                    console.log(' ' + file.path + ': line ' + error.line + ', col ' + error.character + ', code ' + error.code + ', ' + error.reason);
                }
            });
        }
        return cb(null, file); 
    });
};

module.exports = new ErrorHandling();