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

// Define paths.
var distPath = 'dist';
var srcPath = 'src';
var paths = {
    distPath: distPath,
    distComponents: distPath + '/components',
    distLess: distPath + '/less',
    distCSS: distPath + '/css',
    srcPath: srcPath,
    componentsPath : 'src/components',
    lessPath: srcPath + '/less',
    distCompsPath : distPath + '/components',
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
      ' * <%= pkg.name %> <%= pkg.version %>',
      ' * <%= pkg.description %>',
      ' **/',
      ''].join('\n');


// Confgure data objects to pass into banner plugin.
var bannerData = {
    pkg : pkg,
    date: date,
    monthNames: monthNames
}


// Emit the end of the event so further pipes don't continue working
// on pipes that have bad data/files in it. Essentially, errors shouldn't cause
// tasks to exit now.
var onGulpError = function (error) {
    console.log(error);
    this.emit('end');
};

// Success message
var generateSuccess = function(message, showTip) {

    var spacing = "\r\n";
    var spaceDashes = colors.rainbow("---------------------------------------------------");
    
    if(showTip == true) {
        var tipsMessage = colors.gray("TIP: In order to test changes to fabric source, you can view demos for each component inside our /samples directory.") + spacing;
    } else {
        var tipsMessage = "";
    }

    var consoleText = colors.green("Fabric Message: ") + colors.cyan(message);
    var completeMessage = spaceDashes + spacing + spacing + consoleText + spacing + tipsMessage + spacing + spaceDashes;

    return completeMessage;

}

// Helper for retrieving folders
var getFolders = function(dir) {
    return fs.readdirSync(dir)
    .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

// Component parts
var componentsFolders = getFolders(paths.componentsPath);
var catalogContents = "";

// Clean out the distribution folder.
gulp.task('clean-fabric', function() {
    return del.sync([paths.distLess, paths.distCSS]);
});

gulp.task('clean-components', function() {
    return del.sync([paths.distComponents]);
});


//
// Tasks for building Fabric for distribution.
// ----------------------------------------------------------------------------

// Copy all uncompiled LESS files to distribution folder.
gulp.task('copy-fabric', ['clean-fabric'], function () {
    // Copy LESS files.
    return gulp.src('src/less/*')
        .pipe(gulp.dest(paths.distPath + '/less'));
});

gulp.task('copy-components', ['clean-components'], function() {
    // Copy all Components files.
    return gulp.src('src/components/**')
        .pipe(gulp.dest(paths.distPath + '/components'));
});

// All Copy tasks
gulp.task('copy', ['copy-fabric', 'copy-components']);


// Build LESS files for core Fabric and Components into LTR and RTL CSS files.
gulp.task('fabric-less', ['clean-fabric'], function() {

    // Confgure data objects to pass into banner plugin.
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

// Components construction
gulp.task('components-less', ['clean-components'], function() {

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

    // Build full and minified Fabric Components CSS.
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

      // Build full and minified Fabric Components CSS for each Component.
    var indComponents = componentsFolders.map(function(folder) {
        var manifest = JSON.parse(fs.readFileSync(paths.componentsPath + '/' +  folder + '/' +  folder + '.json'));
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
            .pipe(gulp.dest(paths.distCompsPath + '/' + folder))
                .on('error', onGulpError)
            .pipe(rename(folder + '.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distCompsPath  + '/' + folder))
                .on('error', onGulpError);
    });


    // Build full and minified Fabric Components RTL CSS.
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

    return mergeStream(components, componentsRtl, indComponents);
});

gulp.task('build-component-data', folders(paths.componentsPath, function(folder) {
    return gulp.src(paths.componentsPath + '/' +  folder + '/*.html')
            .on('error', onGulpError)
        .pipe(concat(folder + '.html'))
            .on('error', onGulpError)
        .pipe(tap(function(file) {
            storedFiles[folder] = file.contents.toString();
            var curString = storedFiles[folder];
            curString = JSON.stringify(curString);
            //Check if module was already included in string
            if(catalogContents.indexOf(folder + ':') < 0) {
                catalogContents += ', "' + folder + '" : ' + curString + ' ';
            }
        }))
            .on('error', onGulpError);
}));

gulp.task('build-component-examples', ['build-component-data'], folders(paths.componentsPath, function(folder){
    return gulp.src(paths.templatePath + '/'+ 'individual-component-example.html')
        .on('error', onGulpError)
    .pipe(data(function () {
        return { "componentName": folder, "stored": storedFiles[folder] };
    }))
        .on('error', onGulpError)
    .pipe(template())
        .on('error', onGulpError)
    .pipe(rename(folder + '-demos.html'))
        .on('error', onGulpError)
    .pipe(gulp.dest(paths.distCompsPath + '/' +  folder))
        .on('error', onGulpError);
}));


// Roll up static resource building
gulp.task('build-fabric', ['clean-fabric', 'copy-fabric', 'fabric-less']);

// Build for fabric component demos
gulp.task('build-components', ['clean-components', 'copy-components', 'components-less', 'build-component-data', 'build-component-examples']);


// Fabric success messages
gulp.task('fabric-finished', ['build-fabric'], function() {
    console.log(generateSuccess('Fabric core-build complete, you may now celebrate and dance!', true));
});

gulp.task('fabric-updated', ['build-fabric'], function() {
    console.log(generateSuccess(' Fabric updated succesfully', false));
});

gulp.task('components-finished', ['build-components'], function() {
    console.log(generateSuccess(' Components build was succesfull! Yay!', true));
});

gulp.task('components-updated', ['build-components'], function() {
    console.log(generateSuccess(' Components updated succesfully! Yay!'));
});

gulp.task('fabric-all-finished', ['build-fabric'], function() {
    console.log(generateSuccess('All Fabric parts built succesfully, you may now celebrate and dance!', true));
});

gulp.task('fabric-all-updated', ['build-fabric'], function() {
    console.log(generateSuccess('All Fabric parts updated succesfully! Yay!', true));
});


// Fabric watch tasks
gulp.task('watch:components', ['build-components', 'components-finished'], function() {
    return gulp.watch(paths.componentsPath + '/**/*', batch(function(events, done) {
        runSequence('build-components', 'components-updated', done);
    }));
});

// Watch and build Fabric when sources change.
gulp.task('watch:fabric', ['build-fabric', 'fabric-finished'], function() {
    return gulp.watch(paths.lessPath + '/**/*', batch(function(events, done) {
        runSequence('build-fabric', 'fabric-updated', done);
    }));
});

// Watch components and fabric at the same time but build seperately.
gulp.task('watch:separately', ['build-fabric', 'build-components', 'fabric-finished'], function() {

    gulp.watch(paths.lessPath + '/**/*', batch(function(events, done) {
        runSequence('build-fabric', 'fabric-updated', done);
    }));

    gulp.watch(paths.componentsPath + '/**/*', batch(function(events, done) {
        runSequence('build-components', 'components-updated', done);
    }));

});

// Watch and build Fabric when sources change.
gulp.task('watch', ['build-fabric', 'build-components', 'fabric-all-finished'], function() {

    gulp.watch(paths.srcPath + '/**/*', batch(function(events, done) {
        runSequence('build-fabric', 'build-components', 'fabric-all-updated', done);
    }));

});

