var gulp = require('gulp');

// Fabric Helper Modules
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('Fabric-nuke', function () {
    return Plugins.del.sync([Config.paths.distLess, Config.paths.distCSS]);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// Copy all LESS files to distribution folder.
gulp.task('Fabric-copyAssets', function () {
    // Copy LESS files.
    return gulp.src([Config.paths.srcLess, Config.paths.srcSass])
            .pipe(Plugins.changed(Config.paths.distLess))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Moving LESS files over to Dist"
            })))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(gulp.dest(Config.distPath))
                .on('error', ErrorHandling.onErrorInPipe);
});

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build LESS files for core Fabric into LTR and RTL CSS files.
gulp.task('Fabric-buildLess', function () {
    var srcPath;
    var cssPlugin;
    
    // Baseline set of tasks for building Fabric CSS.
    if(Config.cssPreprocessor == "sass") {
        srcPath = Config.paths.srcSass;
        cssPlugin = Plugins.sass;
    } else {
        srcPath = Config.paths.srcLess;
        cssPlugin = Plugins.less;
    }
    
    var fabric = gulp.src(srcPath + '/' + 'Fabric.sass')
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building Core Fabric" + Config.cssPreprocessor
            })))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(cssPlugin())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.rename('fabric.css'))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.cssbeautify())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.csscomb())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(gulp.dest(Config.paths.distCSS))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.rename('fabric.min.css'))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.cssMinify())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(gulp.dest(Config.paths.distCSS))
                .on('error', ErrorHandling.onErrorInPipe);
                
    // Build full and minified Fabric RTL CSS.
    var fabricRtl = gulp.src(srcPath + '/' + 'Fabric.Rtl.less')
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building RTL Fabric LESS"
            })))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(cssPlugin())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.flipper())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.rename('fabric.rtl.css'))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.cssbeautify())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.csscomb())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(gulp.dest(Config.paths.distCSS))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.rename('fabric.rtl.min.css'))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.cssMinify())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(gulp.dest(Config.paths.distCSS))
                .on('error', ErrorHandling.onErrorInPipe);
    // Merge all current streams into one.
    return Plugins.mergeStream(fabric, fabricRtl);
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

gulp.task('Fabric', ['Fabric-copyAssets', 'Fabric-buildLess']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('Fabric-finished', ['Fabric'], function () {
    console.log(ConsoleHelper.generateSuccess('Fabric core-build complete, you may now celebrate and dance!', true));
});

gulp.task('Fabric-updated', ['Fabric'], function () {
    console.log(ConsoleHelper.generateSuccess(' Fabric updated successfully', false));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch and build Fabric when sources change.
gulp.task('Fabric-watch', ['Fabric', 'Fabric-finished'], function () {
    return gulp.watch(Config.paths.lessPath + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence('Fabric', 'Fabric-updated', done);
    }));
});
