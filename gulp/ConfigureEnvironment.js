var gulp = require('gulp');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var Plugins = require('./modules/Plugins');
var ErrorHandling = require('./modules/ErrorHandling');

gulp.task('ConfigureEnvironment-setDebugMode', function() {
    Config.debugMode = true;
    return;
});
