var gulp = require('gulp');

// Fabric Helper Modules
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');

var srcPath;
var cssPlugin;
var fileExtension;
var prefixLinter;

//
// Configure Tasks
// ----------------------------------------------------------------------------
gulp.task('Fabric-configureBuild', function () {
    // Check if building SASS
    if (Config.buildSass) {
        srcPath = Config.paths.srcSass;
        cssPlugin = Plugins.sass;
        fileExtension = Config.sassExtension;
    } else {
        srcPath = Config.paths.srcLess;
        cssPlugin = Plugins.less;
        fileExtension = Config.lessExtension;
    }
    return;
});


//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('Fabric-nuke', function () {
    return Plugins.del.sync([Config.paths.distLess, Config.paths.distCSS, Config.paths.distSass]);
});

//
// Style Linting
// ---------------------------------------------------------------------------
gulp.task('Fabric-styleHinting',  function() {
    if (Config.buildSass) {
        var stream;
        stream = gulp.src(Config.paths.srcSass + '/Fabric.scss')
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Checking SASS Compile errors and linting"
            })))
            .pipe(Plugins.scsslint())
            .pipe(ErrorHandling.SASSlintErrors());
      
    } else {
        stream = gulp.src(Config.paths.srcLess + '/Fabric.less')
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Checking LESS Compile errors and linting"
            })))
            .pipe(Plugins.lesshint({
                configPath: './.lesshintrc'
            }))
            .pipe(ErrorHandling.LESSHintErrors());
    }
    return stream;
});


//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// Copy all LESS files to distribution folder.
gulp.task('Fabric-copyAssets', function () {
    // Copy LESS files.
     var moveLess = gulp.src([Config.paths.srcLess + '/**/*'])
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.changed(Config.paths.distLess))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Moving LESS Assets over to Dist"
            })))
            .pipe(gulp.dest(Config.paths.distLess));
                
     var moveSass =  gulp.src([Config.paths.srcSass + '/**/*'])
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.changed(Config.paths.distSass))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Moving SASS files over to Dist"
            })))
            .pipe(gulp.dest(Config.paths.distSass));
     return Plugins.mergeStream(moveLess, moveSass);
});

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build LESS files for core Fabric into LTR and RTL CSS files.
gulp.task('Fabric-buildStyles', ['Fabric-configureBuild', 'Fabric-styleHinting'], function () {
    var fabric = gulp.src(srcPath + '/' + 'Fabric.' + fileExtension)
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building Core Fabric " + fileExtension + " File"
            })))
            .pipe(cssPlugin().on('error', ErrorHandling.LESSCompileErrors))
            .pipe(Plugins.rename('fabric.css'))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
            .pipe(Plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(gulp.dest(Config.paths.distCSS))
            .pipe(Plugins.rename('fabric.min.css'))
            .pipe(Plugins.cssMinify())
            .pipe(gulp.dest(Config.paths.distCSS));
                
    // Build full and minified Fabric RTL CSS.
    var fabricRtl = gulp.src(srcPath + '/' + 'Fabric.Rtl.' + fileExtension)
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building RTL Fabric LESS " + fileExtension + " File"
            })))
            .pipe(cssPlugin().on('error', ErrorHandling.LESSCompileErrors))
            .pipe(Plugins.flipper())
            .pipe(Plugins.rename('fabric.rtl.css'))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
            .pipe(Plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(gulp.dest(Config.paths.distCSS))
            .pipe(Plugins.rename('fabric.rtl.min.css'))
            .pipe(Plugins.cssMinify())
            .pipe(gulp.dest(Config.paths.distCSS));
    // Merge all current streams into one.
    return Plugins.mergeStream(fabric, fabricRtl);
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

gulp.task('Fabric', ['Fabric-configureBuild', 'Fabric-copyAssets', 'Fabric-styleHinting', 'Fabric-buildStyles']);

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