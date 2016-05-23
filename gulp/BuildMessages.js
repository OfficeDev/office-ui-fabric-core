var BuildConfig = require('./modules/BuildConfig');

//
// Fabric Messages
// ----------------------------------------------------------------------------

// var allFinishedtasks = watchTasks.concat(['Errors-checkAllErrors']);
gulp.task('BuildMessages-finished', BuildConfig.buildTasks, function () {
    console.log(ConsoleHelper.generateSuccess('All Fabric built successfully, you may now celebrate and dance!', true));
});

gulp.task('BuildMessages-server', BuildConfig, function () {
    console.log(ConsoleHelper.generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric samples located at ' + Config.projectURL + ':' + Config.port, false));
});

gulp.task('BuildMessages-updated', BuildConfig, function () {
    console.log(ConsoleHelper.generateSuccess('UPDATE COMPLETE: All Fabric parts updated successfully! Yay!', false));
});

BuildConfig.buildTasks.push('Linting');