// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
var gulp = require('gulp');
var plugins = require('./gulp/modules/Plugins');
var config = require('./gulp/modules/config');
var messaging = require('./gulp/modules/messaging');
var fabricServer = require('./gulp/modules/Server');

//////////////////////////
// INCLUDE FABRIC TASKS
//////////////////////////

plugins.requireDir('../../gulp'); // This is from 

//
// Local Server Configuration and Testing Website
// ----------------------------------------------------------------------------

fabricServer.configServer(
   config.port, // Port Number
   config.projectURL, // URL To access the server
   config.projectDirectory // Directory to serve up
);

// Config Paths
fabricServer.serveSpecificPaths(config.servePaths);

gulp.task('fabric-server', function() {
    return fabricServer.start();
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------



//
// Watch Tasks
// ----------------------------------------------------------------------------

var watchTasks = [
    'Fabric', 
    'FabricComponents', 
    'ComponentSamples', 
    'Samples',
    'fabric-server'
];

// Watch and build Fabric when sources change.
gulp.task('watch', watchTasks, function () {
    gulp.watch(config.paths.srcPath + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('re-build', done);
    }));
});

//
// Default Build
// ----------------------------------------------------------------------------

gulp.task('build', ['build-fabric', 'build-fabric-components', 'build-component-samples', 'build-samples', 'build-components-page', 'fabric-all-finished']); 
gulp.task('re-build', ['reset-sample-data', 'reset-component-data', 'build-fabric', 'build-fabric-components', 'build-component-samples', 'build-samples', 'build-components-page', 'fabric-all-finished']); 

gulp.task('default', ['build']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('fabric-all-finished', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(messaging.generateSuccess('All Fabric built successfully, you may now celebrate and dance!', true));
});

gulp.task('fabric-all-server', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(messaging.generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric samples located at ' + config.projectURL + ':' + config.port, false));
});

gulp.task('fabric-all-updated', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(messaging.generateSuccess('All Fabric parts updated successfully! Yay!', true));
});


//
// Packaging tasks
// ----------------------------------------------------------------------------
gulp.task('nuget-pack', function(callback) {
    plugins.nugetpack(config.nugetConfig, config.nugetPaths, callback);
});




