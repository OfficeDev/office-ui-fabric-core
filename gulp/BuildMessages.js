var gulp = require('gulp');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var Config = require('./modules/Config');

//
// Fabric Messages
// ----------------------------------------------------------------------------

// var allFinishedtasks = watchTasks.concat(['Errors-checkAllErrors']);
gulp.task('BuildMessages-finished', BuildConfig.buildTasks, function () {
    return console.log(ConsoleHelper.generateSuccess('Fabric build was successful, now sing and dance!', true));
});

gulp.task('BuildMessages-server', BuildConfig.buildTasks, function () {
    return console.log(ConsoleHelper.generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric documentation located at ' + Config.projectURL + ':' + Config.port, false));
});

gulp.task('BuildMessages-updated', BuildConfig.buildTasks, function () {
    return console.log(ConsoleHelper.generateSuccess('Fabric updated, yay!', false));
});
