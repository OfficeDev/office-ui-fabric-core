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
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('clean-component-samples', function () {
    return del.sync([paths.distSamples + '/Components']);
});


//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('copy-component-samples', ['clean-component-samples'], function() {

    return gulp.src([
            paths.componentsPath + '/**/*.js', 
            paths.componentsPath + '/**/*.jpg', 
            paths.componentsPath + '/**/*.png', 
            paths.componentsPath + '/**/*.js',
            paths.componentsPath + '/**/*.gif'
        ])
        .pipe(gulp.dest(paths.distSamples + '/Components'));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('component-samples-less', ['clean-component-samples'], function() {
   return buildEachComponentCss(paths.distSamples + '/Components/');
});

//
// Sample Component Building
// ----------------------------------------------------------------------------

gulp.task('reset-component-data', function() {
    componentLinks = [];
    storedFiles = {};
    componentsFolders = getFolders(paths.componentsPath);
});

gulp.task('build-component-data', ['clean-component-samples'], folders(paths.componentsPath, function (folder) {

    var manifest = parseManifest(folder);
    var filesArray = manifest.fileOrder;
    var wrapBranches = manifest.wrapBranches;
    var cfiles;
    var newArray;

    if(typeof manifest.fileOrder != "undefined" || manifest.fileOrder != undefined) {
        // build gulp src array
        newArray = filesArray.map(function(file, i) {
            return paths.componentsPath + '/' +  folder + '/' + file;
        });
        cfiles = gulp.src(newArray).on('error', onGulpError);
    } else {
        cfiles = gulp.src(paths.componentsPath + '/' +  folder + '/*.html').on('error', onGulpError);
    }
 
    if(manifest.wrapBranches === true) {
        cfiles.pipe(wrap('<div class="sample-wrapper"><%= contents %></div>'))
            .on('error', onGulpError)
        .pipe(concat(folder + '.html'))
            .on('error', onGulpError)
        .pipe(tap(function (file) {

             storedFiles[folder] = {
                "name": file.basename,
                "contents": file.contents.toString(),
                "files": []
            }

            var curString = file.contents.toString();
            curString = JSON.stringify(curString);

            //Check if module was already included in string
            if(catalogContents.indexOf(folder + ':') < 0) {
                componentLinks.push(buildLinkHtml('Components/' + folder, folder));
            }
        }))
        .on('error', onGulpError);
    } else {
        cfiles.pipe(concat(folder + '.html'))
            .on('error', onGulpError)
        .pipe(tap(function (file) {

            storedFiles[folder] = {
                "name": file.basename,
                "contents": file.contents.toString(),
                "files": []
            }

            var curString = file.contents.toString();
            curString = JSON.stringify(curString);
            //Check if module was already included in string
            if(catalogContents.indexOf(folder + ':') < 0) {
                componentLinks.push(buildLinkHtml('Components/' + folder, folder));
            }
        }))
            .on('error', onGulpError);
    }
    return cfiles;
}));

gulp.task('component-samples-template', ['build-component-data', 'component-samples-add-js'], folders(paths.componentsPath, function (folder) {

    return gulp.src(paths.templatePath + '/'+ 'individual-component-example.html')
            .on('error', onGulpError)
        .pipe(data(function () {
            var jstag = '';
            var files =  storedFiles[folder]["files"];
            for(var o=0; o < files.length; o++) {jstag += files[o];}
            if(typeof storedFiles[folder][folder] != "undefined") { jstag += storedFiles[folder][folder]; }
            return { "componentName": folder, "stored": storedFiles[folder].contents, "jstag": jstag };
        }))
            .on('error', onGulpError)
        .pipe(template())
            .on('error', onGulpError)
        .pipe(rename('index.html'))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distSamples + '/Components/' +  folder))
            .on('error', onGulpError);
}));

gulp.task('component-samples-add-js', ['build-component-data'], folders(paths.componentsPath, function (folder) {

    return gulp.src(paths.componentsPath + '/' + folder + '/*.js')
            .on('error', onGulpError)
      .pipe(foreach(function(stream){
          return stream
            .pipe(tap(function(file) {
                var filename = file.path.replace(/^.*[\\\/]/, '');
                storedFiles[folder]["files"].push('<script type="text/javascript" src="' + filename+ '"></script>' + "\r\b");
            }))
            .on('error', onGulpError);
      }))
      .on('error', onGulpError);
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

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

//Build Fabric Component Samples
gulp.task('build-component-samples', ['clean-component-samples', 'copy-component-samples', 'component-samples-less', 'build-component-data', 'component-samples-template']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('component-samples-finished', ['build-component-samples'], function () {
    console.log(generateSuccess(' Component Samples build was successful! Yay!', true));
});

gulp.task('component-samples-updated', ['build-component-samples'], function () {
    console.log(generateSuccess(' Components Samples updated successfully! Yay!'));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components but, builds the samples only
gulp.task('watch:component-samples', ['build-component-samples', 'build-components-page', 'fabric-server',  'fabric-all-server'], function () {
    return gulp.watch(paths.componentsPath + '/**/*', batch(function (events, done) {
        runSequence('build-component-samples', done);
    }));
});