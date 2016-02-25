// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
var gulp = require('gulp');
var Plugins = require('./gulp/modules/Plugins');
var Config = require('./gulp/modules/Config');
var ConsoleHelper = require('./gulp/modules/ConsoleHelper');
var Server = require('./gulp/modules/Server');
var Utilites = require('./gulp/modules/Utilities');
var ErrorHandling = require('./gulp/modules/ErrorHandling');

var watchTasks = [
    'Fabric', 
    'FabricComponents', 
    'ComponentSamples', 
    'Samples',
    'FabricDemoPage'
];

var buildTasks = [
    'Fabric', 
    'FabricComponents', 
    'ComponentSamples', 
    'Samples', 
    'FabricDemoPage'
];

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

gulp.task('FabricServer', function() {
    return Server.start();
});


//
// Nuke Tasks
// ---------------------------------------------------------------------------
gulp.task('nuke', ['Fabric-nuke', 'FabricComponents-nuke', 'ComponentSamples-nuke', 'Samples-nuke']);

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch Sass
gulp.task('watch-build', ['ComponentSamples', 'Samples', 'FabricDemoPage', 'FabricServer', 'All-server'], function () {
    gulp.watch(Config.paths.srcPath + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence(['Fabric', 'FabricComponents', 'ComponentSamples', 'Samples', 'FabricDemoPage', 'FabricServer', 'All-updated'], done);
    }));
});

gulp.task('watch', ['watch-build']);

gulp.task('watch-debug-build', ['Fabric', 'FabricComponents', 'ComponentSamples', 'Samples', 'FabricDemoPage', 'FabricServer', 'All-server'], function () {
    gulp.watch(Config.paths.srcPath + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence(['Fabric', 'FabricComponents', 'ComponentSamples', 'Samples', 'FabricDemoPage', 'FabricServer', 'All-updated'], done);
    }));
});

gulp.task('watch-debug', ['ConfigureEnvironment-setDebugMode', 'watch-debug-build']);


//
// Check For errors
//
gulp.task('Errors-checkAllErrors', buildTasks,  function() {
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

var buildWithMessages = buildTasks.concat(['Errors-checkAllErrors', 'All-finished']);
gulp.task('build', buildWithMessages);

var rebuildWithMessages = buildTasks.concat(['All-updated']);
gulp.task('re-build', rebuildWithMessages);

gulp.task('default', ['build']);


//
// Fabric Messages
// ----------------------------------------------------------------------------

var allFinishedtasks = watchTasks.concat(['Errors-checkAllErrors']);
gulp.task('All-finished', allFinishedtasks, function () {
    console.log(ConsoleHelper.generateSuccess('All Fabric built successfully, you may now celebrate and dance!', true));
});

gulp.task('All-server', watchTasks, function () {
    console.log(ConsoleHelper.generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric samples located at ' + Config.projectURL + ':' + Config.port, false));
});

gulp.task('All-updated', watchTasks, function () {
    console.log(ConsoleHelper.generateSuccess('UPDATE COMPLETE: All Fabric parts updated successfully! Yay!', false));
});


//
// Packaging tasks
// ----------------------------------------------------------------------------
gulp.task('nuget-pack', function(callback) {
    Plugins.nugetpack(Config.nugetConfig, Config.nugetPaths, callback);
});