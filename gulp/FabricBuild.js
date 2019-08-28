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

var versionCommaDelim = pkg.version.split('.').join(',');

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
function fabricNuke(done) {
    Plugins.del.sync([Config.paths.distCSS, Config.paths.distSass, Config.paths.temp]);
    done();
};

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// Copy all Sass files to distribution folder.
function fabricCopyAssets() {
     return gulp.src([Config.paths.srcSass + '/**/*', Config.paths.srcSass + '/Fabric.Scoped.scss'])
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.changed(Config.paths.distSass))
            .pipe(Plugins.replace('<%= fabricVersion %>', versionCommaDelim))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Moving Sass files over to Dist"
            })))
            .pipe(gulp.dest(Config.paths.distSass));
};

//
// Sass tasks
// ----------------------------------------------------------------------------

function fabricBuildStyles() {
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
              cascade: false
            }))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(gulp.dest(Config.paths.distCSS))
            .pipe(Plugins.rename('fabric.min.css'))
            .pipe(Plugins.cssMinify())
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(gulp.dest(Config.paths.distCSS));    
    
    var fabricScoped = gulp.src(BuildConfig.srcPath + '/' + 'Fabric.Scoped.' + BuildConfig.fileExtension)
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
              title: "Building Core Fabric Scoped " + BuildConfig.fileExtension + " File"
            })))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(Plugins.replace('<%= fabricVersion %>', versionCommaDelim))
            .pipe(BuildConfig.processorPlugin().on('error', BuildConfig.compileErrorHandler))
            .pipe(Plugins.rename('fabric-' + version.major + '.' + version.minor + '.' + version.patch + '.scoped.css'))
            .pipe(Plugins.autoprefixer({
              cascade: false
            }))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(gulp.dest(Config.paths.distCSS))
            .pipe(Plugins.rename('fabric-' + version.major + '.' + version.minor + '.' + version.patch + '.scoped.min.css'))
            .pipe(Plugins.cssMinify())
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(gulp.dest(Config.paths.distCSS));

    // Merge all current streams into one.
    return Plugins.mergeStream(fabric, fabricScoped);
};

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

exports.fabricNuke = fabricNuke;
exports.fabricBuild = gulp.series(fabricCopyAssets,fabricBuildStyles);