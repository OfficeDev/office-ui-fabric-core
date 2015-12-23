var gulp = require('gulp');

// Fabric Helper Modules
var utilities = require('./modules/Utilities');
var banners = require('./modules/Banners');
var fabricServer = require('./modules/Server');
var config = require('./modules/Config');
var messaging = require('./modules/Messaging');
var errorHandling = require('./modules/ErrorHandling');
var plugins = require('./modules/Plugins');

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('Fabric-nuke', function () {
    return plugins.del.sync([config.paths.distLess, config.paths.distCSS]);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// Copy all LESS files to distribution folder.
gulp.task('Fabric-copyLess', function () {
    // Copy LESS files.
    return gulp.src('src/less/*')
            .pipe(plugins.changed(config.paths.distLess))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                    title: "Moving LESS files over to Dist"
            })))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distLess))
                .on('error', errorHandling.onErrorInPipe);
});

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build LESS files for core Fabric into LTR and RTL CSS files.
gulp.task('Fabric-buildLess', function () {
    // Baseline set of tasks for building Fabric CSS.
    var fabric = gulp.src([config.paths.srcLess + '/' + 'fabric.less'])
            .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                    title: "Building Core Fabric LESS"
            })))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.less())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.changed(config.paths.distCSS, {extension: '.css'}))
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
            .pipe(gulp.dest(config.paths.distCSS))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distCSS))
                .on('error', errorHandling.onErrorInPipe);
                
    // Build full and minified Fabric RTL CSS.
    var fabricRtl = gulp.src(config.paths.srcLess + '/' + 'fabric.rtl.less')
            .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                    title: "Building RTL Fabric LESS"
            })))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.less())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.flipper())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.rtl.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.changed(config.paths.distCSS, {extension: '.css'}))
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
            .pipe(gulp.dest(config.paths.distCSS))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.rtl.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distCSS))
                .on('error', errorHandling.onErrorInPipe);
    // Merge all current streams into one.
    return plugins.mergeStream(fabric, fabricRtl);
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

gulp.task('Fabric', ['Fabric-copyLess', 'Fabric-buildLess']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('Fabric-finished', ['Fabric'], function () {
    console.log(messaging.generateSuccess('Fabric core-build complete, you may now celebrate and dance!', true));
});

gulp.task('Fabric-updated', ['Fabric'], function () {
    console.log(messaging.generateSuccess(' Fabric updated successfully', false));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch and build Fabric when sources change.
gulp.task('Fabric-watch', ['Fabric', 'Fabric-finished'], function () {
    return gulp.watch(config.paths.lessPath + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('Fabric', 'Fabric-updated', done);
    }));
});
