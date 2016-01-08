var path = require('path');
var gulputil = require('gulp-util');
var map = require('map-stream');
var Config = require('./Config');
/**
 * Custom Error Handling Class for Various Tasks
 */
var ErrorHandling = function() {
    var errors = [];
    var warnings = [];
    var that = this;
    this.numberOfErrors = function() {
        return errors.length;
    };
    this.numberOfWarnings = function() {
        return warnings.length;
    };
    this.addError = function(error) {
        errors.push(error);
        return;  
    };
    this.generateError = function(error) {
         gulputil.log(gulputil.colors.red(error));
         return;
    }
    this.generateBuildError = function(error) {
        gulputil.log(gulputil.colors.red("Build Error: ") + gulputil.colors.yellow(error));
        return;
    };
    this.showNumberOfErrors = function(numberOfErrors) {
        gulputil.log(gulputil.colors.red("Number Of Errors: " +  gulputil.colors.yellow(numberOfErrors)));
        return;
    };
    this.showSuccessBuild = function(successMessage) {
        gulputil.log(gulputil.colors.red("Succesful Build: " +  gulputil.colors.yellow(successMessage)));
        return;
    };
    this.generatePluginError = function(pluginName, errorString) {
        var gulpError = new gulputil.PluginError(pluginName, errorString, {showStack: false});
        gulputil.log(gulpError.toString());
        that.addError(gulpError.toString());
        return;
    };
    this.createLineErrorMessage = function(messageStart, path, line, character, code, reason) {
        return messageStart
                + gulputil.colors.green(path)
                + ': line ' 
                + line 
                + ', col ' 
                + character 
                + ', code ' 
                + code 
                + ', ' 
                + reason; 
    };
    /**
     * Generic error handler for errors in the Pipe
     * @param {any} error Error message
     */
	this.onErrorInPipe = function(error) {
        if(error) {
            if(error.plugin == 'gulp-less') {
                var errorString = error.message;
                // that.generatePluginError(error.plugin, errorString);
                // that.addError(errorString);
                console.log(error.message);
                return;
            } else {
                that.generateBuildError(error[0]);
                that.addError(error[0]);
                console.log(error);
                return;
            }
        }
        
		that.generateBuildError(Config.genericBuildError);
        that.generateBuildError(error);
        that.addError(error);
        return;
    };
    this.JSHintErrors = map(function (file, cb) {
        if (!file.jshint.success) {
            file.jshint.results.forEach(function (err) {
                if (err) {
                    var error = err.error;
                    var errorString = that.createLineErrorMessage(
                        file.path,
                        error.line,
                        error.character,
                        error.code,
                        error.reason
                    );
                        
                    if(error.id == "(error)") {
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

module.exports = new ErrorHandling();