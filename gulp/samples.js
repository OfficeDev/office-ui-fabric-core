var gulp = require('gulp');
var del = require('del');
var fs = require('fs');
var less = require('gulp-less');
var batch = require('gulp-batch');
var cssMinify = require('gulp-minify-css');
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var file = require('gulp-file');
var flipper = require('gulp-css-flipper');
var autoprefixer = require('gulp-autoprefixer');
var mergeStream = require('merge-stream');
var rename = require('gulp-rename');
var es = require('event-stream');
var _ = require('lodash');
var pkg = require('../package.json');
var header = require('gulp-header');
var zip = require('gulp-zip');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var data = require('gulp-data');
var folders = require('gulp-folders');
var foreach = require('gulp-foreach');
var browserSync = require('browser-sync').create();
var colors = require('colors/safe');
var path = require('path');
var wrap = require('gulp-wrap');
var uglify = require('gulp-uglify');
var nugetpack = require('gulp-nuget-pack');

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
// Clean/Delete Tasks
// ----------------------------------------------------------------------------


gulp.task('clean-samples', function () {
    return del.sync([paths.distSamples + '/*', '!' + paths.distSamples + '/{Components, Components/**}']);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('copy-samples', ['clean-samples'], function () {
    // Copy all samples files.
    return gulp.src('src/samples/**')
        .pipe(gulp.dest(paths.distSamples));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('samples-less', ['clean-samples'], function () {

    // Build minified Fabric Components CSS for each Component.
    return samplesFolders.map(function(folder) {

        return gulp.src(paths.srcSamples + '/' + folder + '/less/' + folder + '.less')
            .pipe(less())
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
            .pipe(gulp.dest(paths.distSamples + '/' + folder + '/css'))
                .on('error', onGulpError)
            .pipe(rename(folder + '.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distSamples + '/' + folder + '/css'))
                .on('error', onGulpError);
    });
});

//
// Sample Component Building
// ----------------------------------------------------------------------------

gulp.task('reset-sample-data', function() {
    samplesLinks = '';
    samplesFolders = getFolders(paths.srcSamples);
});

gulp.task('build-sample-data', ['clean-samples'], folders(paths.srcSamples, function (folder) {
    return gulp.src(paths.srcSamples + '/' +  folder).pipe(tap(function() {
            samplesLinks += buildLinkHtml(folder, folder);
    }));
}));


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


// Roll up for samples
gulp.task('build-samples', ['clean-samples', 'copy-samples', 'samples-less']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('samples-finished', ['build-samples'], function () {
    console.log(generateSuccess('Samples done, experience fabric by sample!', true));
});

gulp.task('samples-updated', ['build-samples'], function () {
    console.log(generateSuccess(' Samples done updating', false));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch and build Fabric when sources change.
gulp.task('watch:samples', ['build-samples', 'samples-finished'], function () {
    return gulp.watch(paths.srcSamples + '/**/*', batch(function (events, done) {
        runSequence('build-samples', 'samples-updated', done);
    }));
});