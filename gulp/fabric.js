var gulp = require('gulp');

// Debug
var debug = require('gulp-debug');

// Fabric Helper Modules
var utilities = require('./utilities');
var banners = require('./banners');
var fabricServer = require('./fabric-server');
var config = require('./config');
var messaging = require('./messaging');
var errorHandling = require('./errorHandling');
var plugins = require('./plugins');

var storedFiles = {};

// Component parts
var componentsFolders = utilities.getFolders(config.paths.componentsPath);
var catalogContents = "";
var samplesFolders = utilities.getFolders(config.paths.srcSamples);



//
// Build Helpers
// ----------------------------------------------------------------------------

var buildEachComponentCss = function (destination) {
    return componentsFolders.map(function(folder) {

        var manifest = utilities.parseManifest(folder);
        var deps = manifest.dependencies || [];

        return gulp.src(config.paths.templatePath + '/'+ 'component-manifest-template.less')
            .pipe(plugins.data(function () {
                return { "componentName": folder, "dependencies": deps };
            }))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.template())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.less())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(plugins.rename(folder + '.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssbeautify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.csscomb())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.cssCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destination + folder))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename(folder + '.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.cssCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destination + folder))
                .on('error', errorHandling.onErrorInPipe);
    });
}




