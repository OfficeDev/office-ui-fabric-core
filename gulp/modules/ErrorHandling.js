var path = require('path');
var map = require('map-stream');
var Config = require('./Config');
var Plugins = require('./Plugins');
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
         Plugins.gutil.log(Plugins.gutil.colors.red(error));
         return;
    }
    /**
     * Using Gulp.util, generate a build error specific messsage to the console, this message has Build Error: prepended to message given
     * @param {string} error Error message to log
     * @return {void}
     */
    this.generateBuildError = function(error) {
        Plugins.gutil.log(Plugins.gutil.colors.red("Build error: ") + Plugins.gutil.colors.yellow(error));
        return;
    };
    /**
     * Using Gulp.util, log the current number of errors
     * @param {number} numberOfErrors The number of errors to log
     * @return {void}
     */
    this.showNumberOfErrors = function(numberOfErrors) {
        Plugins.gutil.log(Plugins.gutil.colors.red("Number of errors: " +  Plugins.gutil.colors.yellow(numberOfErrors)));
        return;
    };
    /**
     * Using Gulp.util, log the current number of warnings
     * @param {number} numberOfWarnings The number of warnings to log
     * @return {void}
     */
    this.showNumberOfWarnings = function(numberOfErrors) {
        Plugins.gutil.log(Plugins.gutil.colors.yellow("Number of warnings: " +  Plugins.gutil.colors.yellow(numberOfErrors)));
        return;
    };
    /**
     * Using Gulp.util, log a successfull message to the console
     * @param {string} successMessage Message to be logged
     * @return {void}
     */
    this.showSuccessBuild = function(successMessage) {
        Plugins.gutil.log(Plugins.gutil.colors.magenta("Successful build: " +  Plugins.gutil.colors.green(successMessage)));
        return;
    };
    /**
     * Create a new instance of Plugin error and console log it.
     * @param {string} pluginName Name of plugin with error
     * @param {string} errorMessage A string containing a complete error messsage to be console logged
     * @return {void}
     */
    this.generatePluginError = function(pluginName, errorMessage) {
        var gulpError = new Plugins.gutil.PluginError(pluginName, errorMessage, {showStack: false});
        Plugins.gutil.log(gulpError.toString());
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
                + Plugins.gutil.colors.green(path)
                + ': '
                + Plugins.gutil.colors.magenta('line ' 
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
                case 'gulp-tslint':
                    this.emit('end');
                    break;
                default:
                    that.generateBuildError(error);
                    that.addError(error);
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
     * TypescriptLinting error handler
     * @param {object} file     Data containing file information
     * @param {function} cb     Callback data with error or no arguments
     */
    this.TypescriptLinting = function(file, cb) {
        return map(function (file, cb) {
            
            if(file.tslint.output) {
                var failures = JSON.parse(file.tslint.output);
                
                if (failures.length > 0) {
                    failures.forEach(function (err) {

                        var errorString = that.createLineErrorMessage(
                            Plugins.gutil.colors.red("Error ") + 'Typescript Linting ', 
                            file.path,
                            (err.startPosition.line + 1),
                            err.startPosition.character + 1,
                            err.ruleName,
                            " "
                        );
                        Plugins.gutil.log(errorString);
                        that.addError(errorString);
                    });
                }
            }
            return cb(null, file); 
        });
    };
    /**
     * TabLinting error handler
     * @param {object} file     Data containing file information
     * @param {function} cb     Callback data with error or no arguments
     */
    this.TabLintingErrors = function(file, cb) {
        return map(function (file, cb) {
            // console.log(file.lintspaces);
            var lintingData = file.lintspaces;
            if (lintingData && Object.keys(lintingData).length) {
               	var lines = [];
                var warningLines = Object.keys(lintingData);
                var warningCount = Object.keys(lintingData).length;
                
                  warningLines.forEach(function (warningLine) {
                    errorString = that.createLineErrorMessage(
                        Plugins.gutil.colors.yellow("Warning") + ' ' + lintingData[warningLine][0].message,
                        file.path,
                        lintingData[warningLine][0].line,
                        ' ',
                        ' ',
                        ' '
                    );
                    Plugins.gutil.log(errorString);
                    that.addWarning(errorString);
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
                            Plugins.gutil.colors.yellow("Warning") + ' ' + message.message,
                            file.path,
                            message.line,
                            ' ',
                            message.ruleId,
                            ' '
                        );
                        Plugins.gutil.log(errorString);
                        that.addWarning(errorString);
                    } else {
                         errorString = that.createLineErrorMessage(
                            Plugins.gutil.colors.red("Error ") + ' ' + message.message,
                            file.path,
                            message.line,
                            ' ',
                            message.ruleId,
                            ' '
                         );
                        Plugins.gutil.log(errorString);
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