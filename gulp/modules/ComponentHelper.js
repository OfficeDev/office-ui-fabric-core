var gulp = require('gulp');
var fs = require('fs');

var Banners = require('./Banners');
var Config = require('./Config');
var ErrorHandling = require('./ErrorHandling');
var Plugins = require('./Plugins');

/**
 * Helper class for building ComponentSamples
 */
var ComponentSamplesHelper = function() {
	/**
     * Builds a commmonly used Gulp task for building a components styles..
     * @param {string} destFolder Contains the path to the destination folder.
     * @param {string} srcTemplate Contains the path to the source template to be applied.
     * @param {string} componentName Name of the component.
     * @param {string} deps LESS Dependencies to be added to the styles.
     * @param {function} cssPlugin The gulp plugin or function used for the specific css preprocessor
     * @return {stream} returns a stream.
     */
    this.buildComponentStyles = function(destFolder, srcTemplate, componentName, deps, cssPlugin, name) {
        
        return gulp.src(srcTemplate)
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Source template found"
                })))
            .pipe(Plugins.data(function () {
                return { "componentName": componentName, "dependencies": deps };
            }))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.template())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(cssPlugin())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(Plugins.rename(componentName + '.css'))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.cssbeautify())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.csscomb())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.header(Banners.getCSSCopyRight()))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building Component Styles " + componentName + " - " + name
                })))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(gulp.dest(destFolder))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.rename(componentName + '.min.css'))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.cssMinify())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.header(Banners.getCSSCopyRight()))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Minifying Component Sample " + name
                })))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(gulp.dest(destFolder))
                .on('error', ErrorHandling.onErrorInPipe);
    }
};

module.exports = new ComponentSamplesHelper();