var path = require('path');
var gulputil = require('gulp-util');
var map = require('map-stream');
var Config = require('./Config');
/**
 * Custom Error Handling Class for Various Tasks
 */
var ErrorHandling = function() {
    /**
     * Stores error messages
     */
    var errors = [];
    /**
     * Stores Warning Messages
     */
    var warnings = [];
    var that = this;
    /**
     * Retrieve the number of errors logged
     * @return {number} number of errors
     */
    this.numberOfErrors = function() {
        return errors.length;
    };
    /**
     * Retrieve the number of warnings logged
     * @return {number} number of warnings
     */
    this.numberOfWarnings = function() {
        return warnings.length;
    };
    /**
     * Add error to errors[] array
     * @param {string} error Error message to add to errors[]
     * @return {void}
     */
    this.addError = function(error) {
        errors.push(error);
        return;  
    };
     /**
     * Add Warnings or warnings[] array
     * @param {string} warning Warning message to add to warnings[]
     * @return {void}
     */
    this.addWarning = function(warning) {
        warnings.push(warning);
        return;  
    };
     /**
     * Using Gulp.util, log a generic formated error to the console
     * @param {string} error Error message to log 
     * @return {void}
     */
    this.generateError = function(error) {
         gulputil.log(gulputil.colors.red(error));
         return;
    }
    /**
     * Using Gulp.util, generate a build error specific messsage to the console, this message has Build Error: prepended to message given
     * @param {string} error Error message to log
     * @return {void}
     */
    this.generateBuildError = function(error) {
        gulputil.log(gulputil.colors.red("Build error: ") + gulputil.colors.yellow(error));
        return;
    };
    /**
     * Using Gulp.util, log the current number of errors
     * @param {number} numberOfErrors The number of errors to log
     * @return {void}
     */
    this.showNumberOfErrors = function(numberOfErrors) {
        gulputil.log(gulputil.colors.red("Number of errors: " +  gulputil.colors.yellow(numberOfErrors)));
        return;
    };
    /**
     * Using Gulp.util, log the current number of warnings
     * @param {number} numberOfWarnings The number of warnings to log
     * @return {void}
     */
    this.showNumberOfWarnings = function(numberOfErrors) {
        gulputil.log(gulputil.colors.yellow("Number of warnings: " +  gulputil.colors.yellow(numberOfErrors)));
        return;
    };
    /**
     * Using Gulp.util, log a successfull message to the console
     * @param {string} successMessage Message to be logged
     * @return {void}
     */
    this.showSuccessBuild = function(successMessage) {
        gulputil.log(gulputil.colors.magenta("Successful build: " +  gulputil.colors.green(successMessage)));
        return;
    };
    /**
     * Create a new instance of Plugin error and console log it.
     * @param {string} pluginName Name of plugin with error
     * @param {string} errorMessage A string containing a complete error messsage to be console logged
     * @return {void}
     */
    this.generatePluginError = function(pluginName, errorMessage) {
        var gulpError = new gulputil.PluginError(pluginName, errorMessage, {showStack: false});
        gulputil.log(gulpError.toString());
        that.addError(gulpError.toString());
        return;
    };
    /**
     * Helper function for creating a pretty error message.
     * @param {string} messageStart The beginning of the error message usually "Error has occurred, not yay.. "
     * @param {string} path Path or file location of error, source file as well
     * @param {string} line The line number  where the error occurred
     * @param {string} character The character or column of the error
     * @param {string} code The error code associtated with this (optional)
     * @param {string} reason The error message/reason that the error occurred
     * @return {string} Containing all of the parameters joined together and formatted to look pretty.
     */
    this.createLineErrorMessage = function(messageStart, path, line, character, code, reason) {
        return messageStart
                + gulputil.colors.green(path)
                + ': '
                + gulputil.colors.magenta('line ' 
                + line
                + ', col ' 
                + character)
                + ', code ' 
                + code 
                + ', ' 
                + reason; 
    };
    /**
     * Generic error handler for errors in the Pipe
     * @param {object} error Error message
     * @return {void}
     */
	this.onErrorInPipe = function(error) {
        if (error) {
            switch(error.plugin) {
                case 'gulp-autoprefixer':
                    break;
                case 'gulp-sass':
                    this.emit('end');
                    break;
                default:
                    that.generateBuildError(error[0]);
                    that.addError(error[0]);
                    break;
            }
            return;
        }
		    that.generateBuildError(Config.genericBuildError);
        that.generateBuildError(error);
        that.addError(error);
        return;
    };
    /**
     * JsHint error handler
     * @param {object} file     Data containing file information
     * @param {function} cb     Callback data with error or no arguments
     */
    this.JSHintErrors = function(file, cb) {
        return map(function (file, cb) {
            if (!file.jshint.success) {
                file.jshint.results.forEach(function (err) {
                    if (err) {
                        var error = err.error;
                        var errorString = that.createLineErrorMessage(
                            'Error occurred in JSHint ', 
                            file.path,
                            error.line,
                            error.character,
                            error.code,
                            error.reason
                        );
                            
                        if (error.id == "(error)") {
                            that.generatePluginError('jsHint', errorString);
                        } else {
                            gulputil.log(errorString);
                            that.addError(errorString);
                        }
                    }
                });
            }
            return cb(null, file); 
        });
    };
    /**
     * Sass Compiler error handler
     * @param {object} error An object containing the error data.
     */
    this.SASSCompileErrors = function(error) {
        var errorString = that.createLineErrorMessage(
            ' ' + error.file,
            error.line,
            error.column,
            'No Code',
            error.messageFormatted
        );
        that.generatePluginError('SASS compiler', errorString);
        this.emit('end');
    }
    /**
     * SASSHint error handler
     * @param {object} file     Data containing file information
     */
    this.SASSlintErrors = function(file, cb) {
        return map(function (file, cb) {
            var errors = file.sassLint[0];
            var messages = errors.messages;
            if (messages.length > 0) {
                for(var i = 0; i < messages.length; i++) {
                   var message = messages[i];
                   var errorString;
                    if (message.severity == 1) {
                        errorString = that.createLineErrorMessage(
                            gulputil.colors.yellow("Warning") + ' ' + message.message,
                            file.path,
                            message.line,
                            ' ',
                            message.ruleId,
                            ' '
                        );
                        gulputil.log(errorString);
                        that.addWarning(errorString);
                    } else {
                         errorString = that.createLineErrorMessage(
                            gulputil.colors.red("Error ") + ' ' + message.message,
                            file.path,
                            message.line,
                            ' ',
                            message.ruleId,
                            ' '
                         );
                        gulputil.log(errorString);
                        that.addError(errorString);
                    }
                }
              return cb(errorString);
            } else {
              return cb(null, file);
            }
             
        }, {failures: true});
    };
};

module.exports = new ErrorHandling();