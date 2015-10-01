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
var browserSync = require('browser-sync').create();
var colors = require('colors/safe');
var path = require('path');
var wrap = require('gulp-wrap');
var uglify = require('gulp-uglify');

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
var componentLinks = "";
var samplesLinks = "";
var samplesFolders = getFolders(paths.srcSamples);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('clean-fabric', function () {
    return del.sync([paths.distLess, paths.distCSS]);
});

gulp.task('clean-fabric-components', function () {
    return del.sync([paths.distComponents, paths.distJS]);
});

gulp.task('clean-component-samples', function () {
    return del.sync([paths.distSamples + '/Components']);
});

gulp.task('clean-samples', function () {
    return del.sync([paths.distSamples + '/*', '!' + paths.distSamples + '/{Components, Components/**}']);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// Copy all LESS files to distribution folder.
gulp.task('copy-fabric', ['clean-fabric'], function () {
    // Copy LESS files.
    return gulp.src('src/less/*')
        .pipe(gulp.dest(paths.distPath + '/less'));
});

gulp.task('copy-fabric-components', ['clean-fabric-components'], function () {
    // Copy all Components files.
    return gulp.src('src/components/**')
        .pipe(gulp.dest(paths.distComponents));
});

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

gulp.task('copy-samples', ['clean-samples'], function () {
    // Copy all samples files.
    return gulp.src('src/samples/**')
        .pipe(gulp.dest(paths.distSamples));
});

// All Copy tasks
gulp.task('copy', ['copy-fabric', 'copy-fabric-components', 'copy-component-samples', 'copy-samples']);

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build LESS files for core Fabric into LTR and RTL CSS files.
gulp.task('fabric-less', ['clean-fabric'], function () {
    // Configure data objects to pass into banner plugin.
    var bannerData = {
        pkg : pkg,
        date: date,
        monthNames: monthNames
    }
    // Baseline set of tasks for building Fabric CSS.
    var _fabricBase = function() {
        return gulp.src(['src/less/fabric.less'])
            .pipe(less())
                .on('error', onGulpError)
            .pipe(rename('fabric.css'))
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
                .on('error', onGulpError);
    }
    // Build full and minified Fabric CSS.
    var fabric = _fabricBase()
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError)
            .pipe(rename('fabric.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError);
    // Build full and minified Fabric RTL CSS.
    var fabricRtl = gulp.src('src/less/fabric.rtl.less')
            .pipe(less())
                .on('error', onGulpError)
            .pipe(flipper())
                .on('error', onGulpError)
            .pipe(rename('fabric.rtl.css'))
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
                .on('error', onGulpError)
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError)
            .pipe(rename('fabric.rtl.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError);
    // Merge all current streams into one.
    return mergeStream(fabric, fabricRtl);
});

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

gulp.task('component-samples-less', ['clean-component-samples'], function() {
   return buildEachComponentCss(paths.distSamples + '/Components/');
});

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
// Sample Component Building
// ----------------------------------------------------------------------------

gulp.task('reset-component-data', function() {
    componentLinks = '';
    storedFiles = {};
    componentsFolders = getFolders(paths.componentsPath);
});

gulp.task('reset-sample-data', function() {
    samplesLinks = '';
    samplesFolders = getFolders(paths.srcSamples);
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
                "contents": file.contents.toString()
            }

            var curString = file.contents.toString();
            curString = JSON.stringify(curString);

            //Check if module was already included in string
            if(catalogContents.indexOf(folder + ':') < 0) {
                componentLinks += buildLinkHtml('Components/' + folder, folder);
            }
        }))
        .on('error', onGulpError);
    } else {
        cfiles.pipe(concat(folder + '.html'))
            .on('error', onGulpError)
        .pipe(tap(function (file) {

            storedFiles[folder] = {
                "name": file.basename,
                "contents": file.contents.toString()
            }

            var curString = file.contents.toString();
            curString = JSON.stringify(curString);
            //Check if module was already included in string
            if(catalogContents.indexOf(folder + ':') < 0) {
                componentLinks += buildLinkHtml('Components/' + folder, folder);
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
            if(typeof storedFiles[folder].script != "undefined") { jstag = storedFiles[folder].script; }
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
        .pipe(tap(function(file) {
            var filename = file.path.replace(/^.*[\\\/]/, '')
            storedFiles[folder].script = '<script type="text/javascript" src="' + filename+ '"></script>';
        }))
            .on('error', onGulpError);
}));

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
        return { "components": buildLinkContainer(componentLinks), "samples" :  buildLinkContainer(samplesLinks)};
    }))
        .on('error', onGulpError)
    .pipe(template())
        .on('error', onGulpError)
    .pipe(rename('index.html'))
        .on('error', onGulpError)
    .pipe(gulp.dest(paths.distSamples))
        .on('error', onGulpError);
}); 

// gulp.task('index-build-all', ['build-components-page']);

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

gulp.task('build-fabric', ['clean-fabric', 'copy-fabric', 'fabric-less']);

// Build for Fabric component demos
gulp.task('build-fabric-components', ['clean-fabric-components', 'copy-fabric-components', 'fabric-components-less', 'fabric-components-js']);

//Build Fabric Component Samples
gulp.task('build-component-samples', ['clean-component-samples', 'copy-component-samples', 'component-samples-less', 'build-component-data', 'component-samples-template']);

// Roll up for samples
gulp.task('build-samples', ['clean-samples', 'copy-samples', 'samples-less']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('fabric-finished', ['build-fabric'], function () {
    console.log(generateSuccess('Fabric core-build complete, you may now celebrate and dance!', true));
});

gulp.task('fabric-updated', ['build-fabric'], function () {
    console.log(generateSuccess(' Fabric updated successfully', false));
});

gulp.task('fabric-components-finished', ['build-fabric-components'], function () {
    console.log(generateSuccess(' Components build was successful! Yay!', true));
});

gulp.task('fabric-components-updated', ['build-fabric-components'], function () {
    console.log(generateSuccess(' Components updated successfully! Yay!'));
});

gulp.task('component-samples-finished', ['build-component-samples'], function () {
    console.log(generateSuccess(' Component Samples build was successful! Yay!', true));
});

gulp.task('component-samples-updated', ['build-component-samples'], function () {
    console.log(generateSuccess(' Components Samples updated successfully! Yay!'));
});

gulp.task('fabric-all-finished', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('All Fabric parts built successfully, you may now celebrate and dance!', true));
});

gulp.task('fabric-all-server', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric samples located at ' + url + ':' + portNum, false));
});

gulp.task('fabric-all-updated', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('All Fabric parts updated successfully! Yay!', true));
});

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
gulp.task('watch:fabric', ['build-fabric', 'fabric-finished'], function () {
    return gulp.watch(paths.lessPath + '/**/*', batch(function (events, done) {
        runSequence('build-fabric', 'fabric-updated', done);
    }));
});

// Watches all src fabric components and builds fabric.components.
gulp.task('watch:fabric-components', ['build-fabric-components', 'fabric-components-finished'], function () {
    return gulp.watch(paths.componentsPath + '/**/*', batch(function (events, done) {
        runSequence('build-fabric-components', 'fabric-components-updated', done);
    }));
});

// Watches all src fabric components but, builds the samples only
gulp.task('watch:component-samples', ['build-component-samples', 'samples-index-build-components', 'fabric-server', 'component-samples-finished'], function () {
    return gulp.watch(paths.componentsPath + '/**/*', batch(function (events, done) {
        runSequence('build-component-samples', 'samples-index-build-all', 'component-samples-updated', done);
    }));
});

// Watch and build Fabric when sources change.
gulp.task('watch:samples', ['build-samples', 'samples-finished'], function () {
    return gulp.watch(paths.srcSamples + '/**/*', batch(function (events, done) {
        runSequence('build-samples', 'samples-updated', done);
    }));
});

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

