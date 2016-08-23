// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
var gulp = require('gulp');
var Plugins = require('./gulp/modules/Plugins');
var Config = require('./gulp/modules/Config');
var ConsoleHelper = require('./gulp/modules/ConsoleHelper');
var Server = require('./gulp/modules/Server');
var Utilites = require('./gulp/modules/Utilities');
var ErrorHandling = require('./gulp/modules/ErrorHandling');
var BuildConfig = require('./gulp/modules/BuildConfig');

//////////////////////////
// INCLUDE FABRIC TASKS
//////////////////////////

Plugins.requireDir('../../gulp');

//
// Local Server Configuration and Testing Website
// ----------------------------------------------------------------------------

Server.configServer(
   Config.port, // Port Number
   Config.projectURL, // URL To access the server
   Config.projectDirectory // Directory to serve up
);

// Config Paths
Server.serveSpecificPaths(Config.servePaths);

//
// Nuke Tasks
// ---------------------------------------------------------------------------
gulp.task('nuke', BuildConfig.nukeTasks);

//
// Watch Tasks
// ----------------------------------------------------------------------------
gulp.task('watch-build-tasks', BuildConfig.buildTasks);
gulp.task('watch-build', BuildConfig.buildTasks, function () {
    return gulp.watch(Config.paths.src + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence('watch-build-tasks', done);
    }));
});

gulp.task('watch', ['watch-build', 'Server', 'BuildMessages-server']);

// Debug Tasks
gulp.task('watch-debug-build-tasks', BuildConfig.buildTasks);
gulp.task('watch-debug-build', BuildConfig.buildTasks, function () {
    return gulp.watch(Config.paths.src + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence('watch-debug-build-tasks', 'BuildMessages-updated', done);
    }));
});
gulp.task('watch-debug', ['ConfigureEnvironment-setDebugMode', 'Server', 'watch-debug-build', 'BuildMessages-server']);

//
// Check For errors
//
gulp.task('Errors-checkAllErrors', BuildConfig.buildTasks,  function() {
    var returnFailedBuild = false;
     if (ErrorHandling.numberOfErrors() > 0) {
         ErrorHandling.generateError("------------------------------------------");
         ErrorHandling.generateBuildError("Errors in build, please fix and re build Fabric");
         ErrorHandling.showNumberOfErrors(ErrorHandling.numberOfErrors());
         ErrorHandling.generateError("------------------------------------------");
         ErrorHandling.generateBuildError("Exiting build");
         ErrorHandling.generateError("------------------------------------------");
         returnFailedBuild = true;
     }
          
     if (ErrorHandling.numberOfWarnings() > 0) {
         ErrorHandling.generateError("------------------------------------------");
         ErrorHandling.generateBuildError("Warnings in build, please fix and re build Fabric");
         ErrorHandling.showNumberOfWarnings(ErrorHandling.numberOfWarnings());
         ErrorHandling.generateError("------------------------------------------");
         ErrorHandling.generateBuildError("Exiting build");
         ErrorHandling.generateError("------------------------------------------");

         returnFailedBuild = true;
     }
     
     if (returnFailedBuild) {
        process.exit(1);
     } else {
        return;
     }
});


//
// Default Build
// ----------------------------------------------------------------------------

var buildWithMessages = BuildConfig.buildTasks.concat(['Errors-checkAllErrors', 'BuildMessages-finished']);
gulp.task('build', buildWithMessages);

var rebuildWithMessages = BuildConfig.buildTasks.concat(['BuildMessages-finished']);
gulp.task('re-build', rebuildWithMessages);

gulp.task('default', ['build']);

//
// Packaging tasks
// ----------------------------------------------------------------------------
gulp.task('nuget-pack', function(callback) {
    Plugins.nugetpack(Config.nugetConfig, Config.nugetPaths, callback);
});