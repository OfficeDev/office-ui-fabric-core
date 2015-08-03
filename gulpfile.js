var gulp = require('gulp');
var tsc = require('gulp-typescript');
var del = require('del');
var fs = require('fs');
var flatten = require('gulp-flatten');
var uglify = require('gulp-uglifyjs');
var less = require('gulp-less');
var batch = require('gulp-batch');
var cssMinify = require('gulp-minify-css');
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var file = require('gulp-file');
var flipper = require('gulp-css-flipper');
var autoprefixer = require('gulp-autoprefixer');
var texttojs = require('gulp-texttojs');
var htmlMinify = require('gulp-minify-html');
var size = require('gulp-size');
var mergeStream = require('merge-stream');
var chmod = require('gulp-chmod');
var jeditor = require('gulp-json-editor');
var rename = require('gulp-rename');
var es = require('event-stream');
var path = require('path');
var _ = require('lodash');
var express = require('express');
var pkg = require('./package.json');
var log = require('./docs/build/log.js');
var header = require('gulp-header');
var zip = require('gulp-zip');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var concat = require('gulp-concat');
var app = express();
var wait = require('gulp-wait');
var fs = require('fs');
var tap = require('gulp-tap');
var data = require('gulp-data');
var folders = require('gulp-folders');
var browserSync = require('browser-sync').create();
var argv = require('yargs').argv;
var colors = require('colors/safe');

var requireDir = require('require-dir');


requireDir('./gulp-tasks');

//
// Default tasks.
// ----------------------------------------------------------------------------

gulp.task('default', ['build-fabric']);
