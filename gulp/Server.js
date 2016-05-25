var gulp = require('gulp');
var BuildConfig = require('./modules/BuildConfig');
var Server = require('./modules/Server');
var running = false;

gulp.task('Server', function(cb) {
    return Server.start(); 
});
