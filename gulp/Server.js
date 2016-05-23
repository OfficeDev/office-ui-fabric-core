var gulp = require('gulp');
var BuildConfig = require('./modules/BuildConfig');
var Server = require('./modules/Server');
var running = false;

gulp.task('FabricServer', function() {
  if(!running) {
    running = true;
    return Server.start();
  }
});

BuildConfig.buildTasks.push('FabricServer');