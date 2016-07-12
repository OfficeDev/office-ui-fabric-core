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
     * @param {string} deps Sass Dependencies to be added to the styles.
     * @param {function} cssPlugin The gulp plugin or function used for the specific css preprocessor
     * @param {boolean} showSize Whether or not to show the size of built files after compiling
     * @param {boolean} outputSass Whether or not to also output the SCSS file used
     * @return {stream} returns a stream.
     */
    this.buildComponentStyles = function(destFolder, srcTemplate, componentName, deps, processorPlugin, name, errorHandler, showSize, outputSass) {
        return gulp.src(srcTemplate)
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
              title: "Building Component Styles"
            })))
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.data(function () {
              return { "componentName": componentName, "dependencies": deps };
            }))
            .pipe(Plugins.template())
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.gulpif(outputSass, Plugins.rename(componentName + '.scss')))
            .pipe(Plugins.gulpif(outputSass, gulp.dest(destFolder)))
            .pipe(processorPlugin().on('error', errorHandler))
            .pipe(Plugins.autoprefixer({
              browsers: ['last 2 versions', 'ie >= 9'],
              cascade: false
            }))
            .pipe(Plugins.rename(componentName + '.css'))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(Plugins.header(Banners.getCSSCopyRight()))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
              title: "Building Component Styles " + componentName + " - " + name
            })))
            .pipe(gulp.dest(destFolder))
            .pipe(Plugins.rename(componentName + '.min.css'))
            .pipe(Plugins.cssMinify({
              safe: true
            }))
            .pipe(Plugins.header(Banners.getCSSCopyRight()))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
              title: "Minifying Component Sample " + name
            })))
            .pipe(Plugins.gulpif(showSize, Plugins.size({
              'showFiles': true
            })))
            .pipe(gulp.dest(destFolder));
    }
};

module.exports = new ComponentSamplesHelper();