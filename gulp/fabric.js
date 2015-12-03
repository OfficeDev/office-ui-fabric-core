var gulp = require('gulp');

// var less = require('gulp-less');
// var batch = require('gulp-batch');
// var cssMinify = require('gulp-minify-css');
// var csscomb = require('gulp-csscomb');
// var cssbeautify = require('gulp-cssbeautify');
// var file = require('gulp-file');
// var flipper = require('gulp-css-flipper');
// var autoprefixer = require('gulp-autoprefixer');
// var rename = require('gulp-rename');
// var header = require('gulp-header');
// var zip = require('gulp-zip');
// var gutil = require('gulp-util');
// var template = require('gulp-template');
// var concat = require('gulp-concat');
// var tap = require('gulp-tap');
// var data = require('gulp-data');
// var folders = require('gulp-folders');
// var foreach = require('gulp-foreach');
// var wrap = require('gulp-wrap');
// var uglify = require('gulp-uglify');
// var nugetpack = require('gulp-nuget-pack');

var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins({
    scope: ['devDependencies']
});

gulp.task('mehr', function() { 
    console.log(plugins);
});

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

// Define paths.
var distPath = 'dist';
var srcPath = 'src';
var paths = {
    distPath: distPath,
    distComponents: distPath + '/components',
    distLess: distPath + '/less',
    distCSS: distPath + '/css',
    distSamples: distPath + '/samples',
    distSampleComponents: distPath + '/samples/' +  '/Components',
    distJS: distPath + '/js',
    distPackages: distPath + '/packages',
    srcPath: srcPath,
    srcSamples: srcPath + '/samples',
    componentsPath : 'src/components',
    lessPath: srcPath + '/less',
    templatePath : srcPath + '/templates'
};

var storedFiles = {};

//
// Build fabric banner
// ----------------------------------------------------------------------------

var date = new Date();
var monthNames = ["January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"];
var bannerTemplate = ['/**',
      ' * Office UI Fabric <%= pkg.version %>',
      ' * <%= pkg.description %>',
      ' **/',
      ''].join('\n');

// Configure data objects to pass into banner plugin.
var bannerData = {
    pkg : pkg,
    date: date,
    monthNames: monthNames
}

var banners = {
    msMessage: 'Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.',
    jsCopyRight:  function () {
        return '//' + banners.msMessage +  "\r\n";
    },
    htmlCopyRight: function () {
        return '<!-- ' +  banners.msMessage  + ' -->' + "\r\n";
    },
    cssCopyRight: function () {
        return '/* ' +  banners.msMessage  + ' */' + "\r\n";
    } 
} 

//
// Local Server Configuration and Testing Website
// ----------------------------------------------------------------------------
var portNum = process.env.PORT || 2020;
var url = "http://localhost";
var server = require('../server/server');
var rootPath = path.resolve(__dirname, '../' + paths.distSamples);


gulp.task('fabric-server', function() {
    return server.start(portNum, rootPath);
});

 
//
// Build Helpers
// ----------------------------------------------------------------------------

// Emit the end of the event so further pipes don't continue working
// on pipes that have bad data/files in it. Essentially, errors shouldn't cause
// tasks to exit now.
var onGulpError = function (error) {
    console.log(error);
    this.emit('end');
};

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
    return JSON.parse(fs.readFileSync(paths.componentsPath + '/' +  folder + '/' +  folder + '.json'));
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

        return gulp.src(paths.templatePath + '/'+ 'component-manifest-template.less')
            .pipe(data(function () {
                return { "componentName": folder, "dependencies": deps };
            }))
                .on('error', onGulpError)
            .pipe(template())
                .on('error', onGulpError)
            .pipe(less())
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(rename(folder + '.css'))
                .on('error', onGulpError)
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(header(banners.cssCopyRight()))
                .on('error', onGulpError)
            .pipe(gulp.dest(destination + folder))
                .on('error', onGulpError)
            .pipe(rename(folder + '.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(header(banners.cssCopyRight()))
                .on('error', onGulpError)
            .pipe(gulp.dest(destination + folder))
                .on('error', onGulpError);
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
var componentsFolders = getFolders(paths.componentsPath);
var catalogContents = "";
var componentLinks = [];
var samplesLinks = "";
var samplesFolders = getFolders(paths.srcSamples);

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// All Copy tasks
gulp.task('copy', ['copy-fabric', 'copy-fabric-components', 'copy-component-samples', 'copy-samples']);

//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('build-components-page', ['clean-samples', 'build-component-data', 'build-sample-data'], function() {
    return gulp.src(paths.templatePath + '/'+ 'samples-index.html')
        .on('error', onGulpError)
    .pipe(data(function () {
        return { "components": buildLinkContainer(componentLinks.sort().join('')), "samples" :  buildLinkContainer(samplesLinks)};
    }))
        .on('error', onGulpError)
    .pipe(template())
        .on('error', onGulpError)
    .pipe(rename('index.html'))
        .on('error', onGulpError)
    .pipe(gulp.dest(paths.distSamples))
        .on('error', onGulpError);
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
            outputDir: paths.distPackages
        },

        [
            {src: paths.componentsPath, dest: "/content/components/"},
            {src: paths.distCSS, dest: "/content/css/"},
            {src: paths.distJS, dest: "/content/scripts/"},
            {src: paths.distLess, dest: "/content/less/"}
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
    console.log(generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric samples located at ' + url + ':' + portNum, false));
});

gulp.task('fabric-all-updated', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('All Fabric parts updated successfully! Yay!', true));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch components and Fabric at the same time but build separately.
gulp.task('watch:separately', ['build-fabric', 'build-fabric-components', 'fabric-finished'], function () {
    gulp.watch(paths.lessPath + '/**/*', batch(function (events, done) {
        runSequence('build-fabric', 'fabric-updated', done);
    }));

    gulp.watch(paths.componentsPath + '/**/*', batch(function (events, done) {
        runSequence('build-component-samples', 'component-samples-updated', done);
    }));

    gulp.watch(paths.srcSamples + '/**/*', batch(function (events, done) {
        runSequence('build-samples', 'samples-updated', done);
    }));
});

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
    gulp.watch(paths.srcPath + '/**/*', batch(function (events, done) {
        runSequence('re-build', done);
    }));
});

//
// Default Build
// ----------------------------------------------------------------------------

gulp.task('build', ['build-fabric', 'build-fabric-components', 'build-component-samples', 'build-samples', 'build-components-page', 'fabric-all-finished']); 
gulp.task('re-build', ['reset-sample-data', 'reset-component-data', 'build-fabric', 'build-fabric-components', 'build-component-samples', 'build-samples', 'build-components-page', 'fabric-all-finished']); 

