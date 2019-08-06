var gulp = require('gulp');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var Config = require('./modules/Config');

//
// Fabric Messages
// ----------------------------------------------------------------------------

// var allFinishedtasks = watchTasks.concat(['Errors-checkAllErrors']);
function buildMessagesFinished() {
    return console.log(ConsoleHelper.generateSuccess('Fabric build was successful, now sing and dance!', true));
};

function buildMessagesServer() {
    return console.log(ConsoleHelper.generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric documentation located at ' + Config.projectURL + ':' + Config.port, false));
};

function buildMessagesUpdated() {
    return console.log(ConsoleHelper.generateSuccess('Fabric updated, yay!', false));
};

gulp.task('BuildMessages-finished', gulp.series(BuildConfig.buildTasks,buildMessagesFinished));
gulp.task('BuildMessages-server', gulp.series(BuildConfig.buildTasks,buildMessagesServer));
gulp.task('BuildMessages-updated', gulp.series(BuildConfig.buildTasks,buildMessagesUpdated));