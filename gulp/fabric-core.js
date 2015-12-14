var gulp = require('gulp');


// Fabric Helper Modules
var utilities = require('./utilities');
var banners = require('./banners');
var fabricServer = require('./fabric-server');
var config = require('./config');
var messaging = require('./messaging');
var errorHandling = require('./errorHandling');
var plugins = require('./plugins');


//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('clean-fabric', function () {
    return plugins.del.sync([config.paths.distLess, config.paths.distCSS]);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// Copy all LESS files to distribution folder.
gulp.task('copy-fabric', ['clean-fabric'], function () {
    // Copy LESS files.
    return gulp.src('src/less/*')
        .pipe(gulp.dest(config.paths.distPath + '/less'));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build LESS files for core Fabric into LTR and RTL CSS files.
gulp.task('fabric-less', ['clean-fabric'], function () {
    // Baseline set of tasks for building Fabric CSS.
    var _fabricBase = function() {
        return gulp.src(['src/less/fabric.less'])
            .pipe(plugins.less())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
                .on('error', errorHandling.onErrorInPipe);
    }
    // Build full and minified Fabric CSS.
    var fabric = _fabricBase()
            .pipe(plugins.cssbeautify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.csscomb())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distPath + '/css/'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distPath + '/css/'))
                .on('error', errorHandling.onErrorInPipe);
    // Build full and minified Fabric RTL CSS.
    var fabricRtl = gulp.src('src/less/fabric.rtl.less')
            .pipe(plugins.less())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.flipper())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.rtl.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssbeautify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.csscomb())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distPath + '/css/'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.rtl.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distPath + '/css/'))
                .on('error', errorHandling.onErrorInPipe);
    // Merge all current streams into one.
    return plugins.mergeStream(fabric, fabricRtl);
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

gulp.task('build-fabric', ['clean-fabric', 'copy-fabric', 'fabric-less']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('fabric-finished', ['build-fabric'], function () {
    console.log(messaging.generateSuccess('Fabric core-build complete, you may now celebrate and dance!', true));
});

gulp.task('fabric-updated', ['build-fabric'], function () {
    console.log(messaging.generateSuccess(' Fabric updated successfully', false));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch and build Fabric when sources change.
gulp.task('watch:fabric', ['build-fabric', 'fabric-finished'], function () {
    return gulp.watch(config.paths.lessPath + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('build-fabric', 'fabric-updated', done);
    }));
});
