// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
var gulp = require('gulp');
var Plugins = require('./gulp/modules/Plugins');
var Config = require('./gulp/modules/Config');
var ConsoleHelper = require('./gulp/modules/ConsoleHelper');
var Server = require('./gulp/modules/Server');

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

var watchTasks = [
    'Fabric', 
    'FabricComponents', 
    'ComponentSamples', 
    'Samples',
    'FabricDemoPage',
];

// Watch and build Fabric when sources change.
gulp.task('watch', ['Fabric', 'FabricComponents', 'ComponentSamples', 'Samples', 'FabricDemoPage', 'FabricServer', 'All-server'], function () {
    gulp.watch(Config.paths.srcPath + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence(watchTasks, done);
    }));
});

//
// Default Build
// ----------------------------------------------------------------------------

gulp.task('build', ['Fabric', 'FabricComponents', 'ComponentSamples', 'Samples', 'FabricDemoPage', 'All-finished']);
gulp.task('re-build', ['Fabric', 'FabricComponents', 'ComponentSamples', 'Samples', 'FabricServer', 'FabricDemoPage', 'All-updated']);

gulp.task('default', ['build']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('All-finished', watchTasks, function () {
    console.log(ConsoleHelper.generateSuccess('All Fabric built successfully, you may now celebrate and dance!', true));
});

gulp.task('All-server', watchTasks, function () {
    console.log(ConsoleHelper.generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric samples located at ' + Config.projectURL + ':' + Config.port, false));
});

gulp.task('All-updated', watchTasks, function () {
    console.log(ConsoleHelper.generateSuccess('All Fabric parts updated successfully! Yay!', true));
});


//
// Packaging tasks
// ----------------------------------------------------------------------------
gulp.task('nuget-pack', function(callback) {
    Plugins.nugetpack(Config.nugetConfig, Config.nugetPaths, callback);
});




