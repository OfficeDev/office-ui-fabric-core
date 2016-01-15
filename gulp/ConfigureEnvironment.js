var gulp = require('gulp');
var Config = require('./modules/Config');

gulp.task('ConfigureEnvironment-setSassMode', function() {
    Config.buildSass = true;
    return;
});

gulp.task('ConfigureEnvironment-setDebugMode', function() {
    Config.debugMode = true;
    return;
});