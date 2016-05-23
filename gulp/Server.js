var gulp = require('gulp');

gulp.task('FabricServer', function() {
    return Server.start();
});

BuildConfig.buildTasks.push('FabricServer');