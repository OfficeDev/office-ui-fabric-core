var gulp = require('gulp');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var Plugins = require('./modules/Plugins');
var ErrorHandling = require('./modules/ErrorHandling');


gulp.task('ConfigureEnvironment-setLessMode', function() {
    Config.buildSass = false;
    BuildConfig.srcPath = Config.paths.srcLess;
    BuildConfig.processorPlugin = Plugins.less;
    BuildConfig.fileExtension = Config.lessExtension;
    BuildConfig.compileErrorHandler = ErrorHandling.LESSCompileErrors;
    BuildConfig.processorName = "LESS";
    return;
});

gulp.task('ConfigureEnvironment-setSassMode', function() {
    Config.buildSass = true;
    BuildConfig.srcPath = Config.paths.srcSass;
    BuildConfig.processorPlugin = Plugins.sass;
    BuildConfig.fileExtension = Config.sassExtension;
    BuildConfig.compileErrorHandler = ErrorHandling.SASSCompileErrors;
    BuildConfig.processorName = "SASS";
    return;
});

gulp.task('ConfigureEnvironment-setDebugMode', function() {
    Config.debugMode = true;
    return;
});