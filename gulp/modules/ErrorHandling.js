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
    this.addWarning = function(warning) {
        warnings.push(warning);
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
        gulputil.log(gulputil.colors.red("Number Of errors: " +  gulputil.colors.yellow(numberOfErrors)));
        return;
    };
    this.showNumberOfWarnings = function(numberOfErrors) {
        gulputil.log(gulputil.colors.yellow("Number Of warnings: " +  gulputil.colors.yellow(numberOfErrors)));
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
            that.generateBuildError(error[0]);
            that.addError(error[0]);
            console.log(error);
            return;
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
    this.LESSHintErrors = map(function (file, cb) {
        if (!file.lesshint.success) {
            file.lesshint.results.forEach(function (err) {
                if (err) {
                    var errorString = that.createLineErrorMessage(
                         gulputil.colors.yellow(err.severity) + ' ' + err.message,
                         err.file,
                         err.line,
                         err.source,
                         'NA',
                         ''
                    );
                        
                    if(err.severity == "Error") {
                         that.generatePluginError('lessHint', errorString);
                    } else {
                         gulputil.log(errorString);
                         that.addWarning(errorString);
                    }
                }
            });
        }
        return cb(null, file); 
    });
    this.LESSCompileErrors = function(error) {
        var errorString = that.createLineErrorMessage(
            error.filename,
            error.line,
            error.column,
            'No Code',
            error.message
        );
        that.generatePluginError('Less Compiler', errorString);
        this.emit('end');
    }
};

module.exports = new ErrorHandling();