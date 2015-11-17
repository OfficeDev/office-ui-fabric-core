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

// Component parts
var componentsFolders = getFolders(paths.componentsPath);
var catalogContents = "";
var componentLinks = [];
var samplesLinks = "";
var samplesFolders = getFolders(paths.srcSamples);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('clean-fabric-components', function () {
    return del.sync([paths.distComponents, paths.distJS]);
});


//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('copy-fabric-components', ['clean-fabric-components'], function () {
    // Copy all Components files.
    return gulp.src('src/components/**')
        .pipe(gulp.dest(paths.distComponents));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build Components LESS files
gulp.task('fabric-components-less', ['clean-fabric-components'], function () {

    var _componentsBase = function() {
        return gulp.src('src/less/fabric.components.less')
            .pipe(less())
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .on('error', onGulpError);
    }
    // Build components CSS.
    var components = _componentsBase()
        .pipe(rename('fabric.components.css'))
            .on('error', onGulpError)
        .pipe(cssbeautify())
            .on('error', onGulpError)
        .pipe(csscomb())
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distPath + '/css/'))
            .on('error', onGulpError)
        .pipe(rename('fabric.components.min.css'))
            .on('error', onGulpError)
        .pipe(cssMinify())
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distPath + '/css/'))
            .on('error', onGulpError);

    // Build Fabric Components RTL CSS.
    var componentsRtl = _componentsBase()
            .pipe(flipper())
                .on('error', onGulpError)
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(rename('fabric.components.rtl.css'))
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(rename('fabric.components.rtl.min.css'))
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError);

    var componentsCSS = buildEachComponentCss(paths.distComponents + '/');
    return mergeStream(components, componentsRtl, componentsCSS);
});

//
// JS Only tasks
// ----------------------------------------------------------------------------

gulp.task('fabric-components-js', ['clean-fabric-components'], function() {

    return gulp.src(paths.componentsPath + '/**/*.js')
        .pipe(concat('jquery.fabric.js'))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distJS))
            .on('error', onGulpError)
        .pipe(rename('jquery.fabric.min.js'))
            .on('error', onGulpError)
        .pipe(uglify())
            .on('error', onGulpError)
        .pipe(header(banners.jsCopyRight()))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distJS));
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

// Build for Fabric component demos
gulp.task('build-fabric-components', ['clean-fabric-components', 'copy-fabric-components', 'fabric-components-less', 'fabric-components-js']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('fabric-components-finished', ['build-fabric-components'], function () {
    console.log(generateSuccess(' Components build was successful! Yay!', true));
});

gulp.task('fabric-components-updated', ['build-fabric-components'], function () {
    console.log(generateSuccess(' Components updated successfully! Yay!'));
});


//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components and builds fabric.components.
gulp.task('watch:fabric-components', ['build-fabric-components', 'fabric-components-finished'], function () {
    return gulp.watch(paths.componentsPath + '/**/*', batch(function (events, done) {
        runSequence('build-fabric-components', 'fabric-components-updated', done);
    }));
});
