var path = require('path');
var gulputil = require('gulp-util');

var ErrorHandling = function() {
	this.onErrorInPipe = function(error) {
		 console.log(error);
	}
    this.onHTMLError = function(error) {
        console.log(error);
        console.log("Html error occured");
    }
    this.handlHTMLLintError = function(filepath, issues) {
        if (issues.length > 0) {
            issues.forEach(function (issue) {
                gulputil.log(gulputil.colors.cyan('[gulp-htmllint] ') + gulputil.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + gulputil.colors.red('(' + issue.code + ') ' + issue.msg));
            });
    
            process.exitCode = 1;
        }
    }
}

module.exports = new ErrorHandling();