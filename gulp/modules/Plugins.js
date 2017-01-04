// Add plugins here to use throughout the fabric build
/**
 * Class for accessing gulp and node plugins
 */
var Plugins = function() {
	this.colors = require('colors/safe');
	this.del = require('del');
	this.autoprefixer = require('gulp-autoprefixer');
	this.batch = require('gulp-batch');
  	this.changed = require('gulp-changed');
	this.handlebars = require('gulp-compile-handlebars');
	this.flipper = require('gulp-css-flipper');
	this.cssbeautify = require('gulp-cssbeautify');
	this.csscomb = require('gulp-csscomb');
	this.cssMinify = require('gulp-cssnano');
	this.data = require('gulp-data');
	this.fileinclude = require('gulp-file-include');
	this.header = require('gulp-header');
	this.gulpif = require('gulp-if');
	this.lintspaces = require('gulp-lintspaces');
	this.nugetpack = require('gulp-nuget-pack');
	this.plumber = require('gulp-plumber');
	this.rename = require('gulp-rename');
	this.sass = require('gulp-sass');
	this.size = require('gulp-size');
	this.template = require('gulp-template');
	this.tslint = require("gulp-tslint");
	this.tsc = require('gulp-typescript');
	this.gutil = require('gulp-util');
	this.debug = require('gulp-debug');
	this.mergeStream = require('merge-stream');
	this.requireDir = require('require-dir');
	this.runSequence = require('run-sequence');
	this.walkSync = require('walk-sync');
	this.path = require('path');
	this.pkg = require('../../package.json');
	this.fs = require('fs');
	this.replace = require('gulp-replace');
};

module.exports = new Plugins();