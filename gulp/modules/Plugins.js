// Add plugins here to use throughout the fabric build
/**
 * Class for accessing gulp and node plugins
 */
var Plugins = function() {
	this.autoprefixer = require('gulp-autoprefixer');
	this.colors = require('colors/safe');
	this.changed = require('gulp-changed');
	this.cssbeautify = require('gulp-cssbeautify');
	this.csscomb = require('./CssComb');
	this.cssMinify = require('gulp-clean-css');
	this.data = require('gulp-data');
	this.del = require('del');
	this.debug = require('gulp-debug');
	this.fileinclude = require('gulp-file-include');
	this.gulpif = require('gulp-if');
	this.handlebars = require('./HandlebarsCompile');
	this.header = require('gulp-header');
	this.lintspaces = require('./LintSpaces');
	this.log = require('fancy-log');
	this.mergeStream = require('merge-stream');
	this.nugetPack = require('gulp-nuget-pack');
	this.pkg = require('../../package.json');
	this.pluginError = require('plugin-error');
	this.plumber = require('gulp-plumber');
	this.rename = require('gulp-rename');
	this.replace = require('gulp-replace');
	this.requireDir = require('require-dir');
	this.sass = require('gulp-sass');
	this.size = require('gulp-size');
	this.template = require('gulp-template');
	this.tsc = require('gulp-typescript');
	this.tslint = require("gulp-tslint");
	this.walkSync = require('walk-sync');
};

module.exports = new Plugins();