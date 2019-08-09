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

//////////////////////////
// Gulp 4 new imported/exported task format
//////////////////////////
var {buildMessagesFinished, buildMessagesServer, buildMessagesUpdated} = require('./gulp/BuildMessages');
var {documentationBuild,documentationNuke} = require('./gulp/Documentation');
var {fabricBuild, fabricNuke} = require('./gulp/FabricBuild');
var {bundleBuild, bundlesNuke} = require('./gulp/Bundling');
var {setDebugMode} = require('./gulp/ConfigureEnvironment')
var {linting} = require('./gulp/Linting');
var {server} = require('./gulp/Server');

//////////////////////////
// MAIN BUILD
//////////////////////////
var build = gulp.parallel(documentationBuild, fabricBuild, linting);
// var build = gulp.parallel(bundleBuild, documentationBuild, fabricBuild, linting);
// TODO: Comment bundling functionality out for now. Need to resolve glob issue.

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
exports.nuke = gulp.parallel(fabricNuke, documentationNuke, bundlesNuke)

//
// Watch Tasks
// ----------------------------------------------------------------------------
function watchBuild(done) {
    gulp.watch(Config.paths.src + '/**/*', build);
    done();
};

exports.watch = gulp.series(build, server, watchBuild, buildMessagesServer);

//
// Debug Tasks
// ---------------------------------------------------------------------------
function watchDebugBuild(done) {
    gulp.watch(Config.paths.src + '/**/*', gulp.series(build, buildMessagesUpdated));
    done();
};

exports.watchDebug = gulp.series(setDebugMode, build, server, watchDebugBuild, buildMessagesServer);

//
// Check For errors
//
function checkAllErrors(done) {
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
        done();
     } else {
        done();
     }
};


//
// Default Build
// ----------------------------------------------------------------------------

exports.rebuild = gulp.series(build, buildMessagesFinished);
exports.default = gulp.series(build, checkAllErrors, buildMessagesFinished);

//
// Packaging tasks
// ----------------------------------------------------------------------------

exports.nugetPack = function(callback) {
    Plugins.nugetpack(Config.nugetConfig, Config.nugetPaths, callback);
};