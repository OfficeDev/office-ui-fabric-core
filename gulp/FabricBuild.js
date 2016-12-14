var gulp = require('gulp');

// Fabric Helper Modules
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var pkg = require('../package.json');

var versionParts = pkg.version.split('.');

var version = {
    major: versionParts[0],
    minor: versionParts[1],
    patch: versionParts[2]
}

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('Fabric-nuke', function () {
    return Plugins.del.sync([Config.paths.distCSS, Config.paths.distSass, Config.paths.temp]);
});


//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// Copy all Sass files to distribution folder.
gulp.task('Fabric-copyAssets', function () {            
     var moveSass =  gulp.src([Config.paths.srcSass + '/**/*', !Config.paths.srcSass + '/Fabric.Scoped.scss'])
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.changed(Config.paths.distSass))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Moving Sass files over to Dist"
            })))
            .pipe(gulp.dest(Config.paths.distSass));
     return moveSass;
});

//
// Sass tasks
// ----------------------------------------------------------------------------

// Build Sass files for core Fabric into LTR and RTL CSS files.

gulp.task('Fabric-scopedPreBuild', function () {
    var fabricScopedPreBuild = gulp.src(Config.paths.srcTemplate + '/' + 'scoped-fabric-template.' + BuildConfig.fileExtension)
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.data(function () {
              return { "version": version };
            }))
            .pipe(Plugins.template())
            .pipe(Plugins.rename('_Fabric.Scoped.Temp.scss'))
            .pipe(gulp.dest(Config.paths.temp));

    return fabricScopedPreBuild;
});

gulp.task('Fabric-buildStyles', ['Fabric-scopedPreBuild'], function () {
    var fabric = gulp.src(BuildConfig.srcPath + '/' + 'Fabric.' + BuildConfig.fileExtension)
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
              title: "Building Core Fabric " + BuildConfig.fileExtension + " File"
            })))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(BuildConfig.processorPlugin().on('error', BuildConfig.compileErrorHandler))
            .pipe(Plugins.rename('fabric.css'))
            .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
            .pipe(Plugins.autoprefixer({
              browsers: ['last 2 versions', 'ie >= 9'],
              cascade: false
            }))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(gulp.dest(Config.paths.distCSS))
            .pipe(Plugins.rename('fabric.min.css'))
            .pipe(Plugins.cssMinify({
                safe: true
            }))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(gulp.dest(Config.paths.distCSS));    
    
    var fabricScoped = gulp.src(BuildConfig.srcPath + '/' + 'Fabric.Scoped.' + BuildConfig.fileExtension)
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
              title: "Building Core Fabric Scoped " + BuildConfig.fileExtension + " File"
            })))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(BuildConfig.processorPlugin().on('error', BuildConfig.compileErrorHandler))
            .pipe(Plugins.rename('fabric-' + version.major + '.' + version.minor + '.' + version.patch + '.scoped.css'))
            .pipe(Plugins.autoprefixer({
              browsers: ['last 2 versions', 'ie >= 9'],
              cascade: false
            }))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(gulp.dest(Config.paths.distCSS))
            .pipe(Plugins.rename('fabric-' + version.major + '.' + version.minor + '.' + version.patch + '.scoped.min.css'))
            .pipe(Plugins.cssMinify({
                safe: true
            }))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(gulp.dest(Config.paths.distCSS));

    // Build full and minified Fabric RTL CSS.
    var fabricRtl = gulp.src(BuildConfig.srcPath + '/' + 'Fabric.Rtl.' + BuildConfig.fileExtension)
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
              title: "Building RTL Fabric " + BuildConfig.processorName + " " + BuildConfig.fileExtension + " File"
            })))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(BuildConfig.processorPlugin().on('error', BuildConfig.compileErrorHandler))
            .pipe(Plugins.flipper())
            .pipe(Plugins.rename('fabric.rtl.css'))
            .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
            .pipe(Plugins.autoprefixer({
              browsers: ['last 2 versions', 'ie >= 9'],
              cascade: false
            }))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(gulp.dest(Config.paths.distCSS))
            .pipe(Plugins.rename('fabric.rtl.min.css'))
            .pipe(Plugins.cssMinify({
              safe: true
            }))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(gulp.dest(Config.paths.distCSS));

    // Merge all current streams into one.
    return Plugins.mergeStream(fabric, fabricScoped, fabricRtl);
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

gulp.task('Fabric', ['Fabric-copyAssets','Fabric-scopedPreBuild', 'Fabric-buildStyles']);
BuildConfig.buildTasks.push('Fabric');
BuildConfig.nukeTasks.push('Fabric-nuke');