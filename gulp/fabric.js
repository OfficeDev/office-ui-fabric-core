var gulp = require('gulp');

var batch = require('gulp-batch');
var cssMinify = require('gulp-minify-css');
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var file = require('gulp-file');
var flipper = require('gulp-css-flipper');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var header = require('gulp-header');
var zip = require('gulp-zip');
var gutil = require('gulp-util');
var template = require('gulp-template');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var data = require('gulp-data');
var folders = require('gulp-folders');
var foreach = require('gulp-foreach');
var wrap = require('gulp-wrap');
var uglify = require('gulp-uglify');
var nugetpack = require('gulp-nuget-pack');
var less = require('gulp-less');
var del = require('del');
var fs = require('fs');
var path = require('path');
var colors = require('colors/safe');
var _ = require('lodash');
var pkg = require('../package.json');
var mergeStream = require('merge-stream');
var es = require('event-stream');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

// Debug
var debug = require('gulp-debug');

// Fabric Helper Modules
var utilities = require('./utilities');
var banners = require('./banners');
var fabricServer = require('./fabric-server');
var config = require('./config');
var errorHandling = require('./errorHandling');


var storedFiles = {};
console.log(config.paths);

//
// Local Server Configuration and Testing Website
// ----------------------------------------------------------------------------

fabricServer.configServer(
   config.port, // Port Number
   config.projectURL, // URL To access the server
   config.projectDirectory // 
);

// Config Paths
fabricServer.serveSpecificPaths(
    [
        {
            'urlPath': '/css',
            'folderPath': '../css'
        }
    ]
)

gulp.task('fabric-server', function() {
    return fabricServer.start();
});
 
//
// Build Helpers
// ----------------------------------------------------------------------------


// Success message
var generateSuccess = function (message, showTip) {
    var spacing = "\r\n";
    var spaceDashes = colors.rainbow("---------------------------------------------------");
    if(showTip == true) {
        var tipsMessage = colors.gray("TIP: To test changes to Fabric source, check under /samples for demo HTML files of each Component.") + spacing;
    } else {
        var tipsMessage = "";
    }
    var consoleText = colors.green("Fabric Message: ") + colors.cyan(message);
    var completeMessage = spaceDashes + spacing + spacing + consoleText + spacing + tipsMessage + spacing + spaceDashes;
    return completeMessage;
}

var parseManifest = function (folder) {
    
}

// Helper for retrieving folders
var getFolders = function (dir) {
    return fs.readdirSync(dir)
    .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

var buildEachComponentCss = function (destination) {
    return componentsFolders.map(function(folder) {

        var manifest = parseManifest(folder);
        var deps = manifest.dependencies || [];

        return gulp.src(config.paths.templatePath + '/'+ 'component-manifest-template.less')
            .pipe(data(function () {
                return { "componentName": folder, "dependencies": deps };
            }))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(template())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(less())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(rename(folder + '.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(cssbeautify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(csscomb())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(header(banners.cssCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destination + folder))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(rename(folder + '.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(header(banners.cssCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destination + folder))
                .on('error', errorHandling.onErrorInPipe);
    });
}

var buildLinkContainer = function(links) {
    return '<div class="LinkContainer">'+ links +'</div>';
}

var buildLinkHtml = function (href, name) {
    var link = '<a href="' + href + '/" class="ms-Link ms-font-l ms-fontWeight-semilight ms-bgColor-neutralLighter--hover">' + name + '</a>';
    return link;
}

// Component parts
var componentsFolders = getFolders(config.paths.componentsPath);
var catalogContents = "";
var componentLinks = [];
var samplesLinks = "";
var samplesFolders = getFolders(config.paths.srcSamples);

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// All Copy tasks
gulp.task('copy', ['copy-fabric', 'copy-fabric-components', 'copy-component-samples', 'copy-samples']);

//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('build-components-page', ['clean-samples', 'build-component-data', 'build-sample-data'], function() {
    return gulp.src(config.paths.templatePath + '/'+ 'samples-index.html')
        .on('error', errorHandling.onErrorInPipe)
    .pipe(data(function () {
        return { "components": buildLinkContainer(componentLinks.sort().join('')), "samples" :  buildLinkContainer(samplesLinks)};
    }))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(template())
        .on('error', errorHandling.onErrorInPipe)
    .pipe(rename('index.html'))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(gulp.dest(config.paths.distSamples))
        .on('error', errorHandling.onErrorInPipe);
});

//
// Packaging tasks
// ----------------------------------------------------------------------------
gulp.task('nuget-pack', function(callback) {
    nugetpack({
            id: "OfficeUIFabric",
            title: "Office UI Fabric",
            version: pkg.version,
            authors: "Microsoft Corporation",
            owners: "Microsoft Corporation",
            description: "Fabric is a responsive, mobile-first, front-end framework, designed to make it quick and simple for you to create web experiences using the Office Design Language. It’s easy to get up and running with Fabric—whether you’re creating a new Office experience from scratch or adding new features to an existing one.",
            summary: "The front-end framework for building experiences for Office and Office 365.",
            language: "en-us",
            projectUrl: "https://github.com/OfficeDev/Office-UI-Fabric",
            licenseUrl: "https://github.com/OfficeDev/Office-UI-Fabric/blob/master/LICENSE",
            copyright: "Copyright (c) Microsoft Corporation",
            requireLicenseAcceptance: true,
            tags: "Microsoft UI Fabric CSS",
            outputDir: config.paths.distPackages
        },

        [
            {src: config.paths.componentsPath, dest: "/content/components/"},
            {src: config.paths.distCSS, dest: "/content/css/"},
            {src: config.paths.distJS, dest: "/content/scripts/"},
            {src: config.paths.distLess, dest: "/content/less/"}
        ],

        callback
    );
});

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('fabric-all-finished', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('All Fabric built successfully, you may now celebrate and dance!', true));
});

gulp.task('fabric-all-server', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric samples located at ' + config.projectURL + ':' + config.port, false));
});

gulp.task('fabric-all-updated', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('All Fabric parts updated successfully! Yay!', true));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

var watchTasks = [
    'build-fabric', 
    'build-fabric-components', 
    'build-component-samples', 
    'build-samples', 
    'build-components-page', 
    'fabric-server', 
    'fabric-all-server'
];

// Watch and build Fabric when sources change.
gulp.task('watch', watchTasks, function () {
    gulp.watch(config.paths.srcPath + '/**/*', batch(function (events, done) {
        runSequence('re-build', done);
    }));
});

//
// Default Build
// ----------------------------------------------------------------------------

gulp.task('build', ['build-fabric', 'build-fabric-components', 'build-component-samples', 'build-samples', 'build-components-page', 'fabric-all-finished']); 
gulp.task('re-build', ['reset-sample-data', 'reset-component-data', 'build-fabric', 'build-fabric-components', 'build-component-samples', 'build-samples', 'build-components-page', 'fabric-all-finished']); 

