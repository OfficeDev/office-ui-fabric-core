var gulp = require('gulp');
var requireDir = require('require-dir');

//////////////////////////
// INCLUDE FABRIC TASKS
//////////////////////////

requireDir('./gulp');

gulp.task('default', ['watch']);

