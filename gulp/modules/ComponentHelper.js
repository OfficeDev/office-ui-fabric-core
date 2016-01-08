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
     * @param {String} destFolder Contains the path to the destination folder.
     * @param {String} srcTemplate Contains the path to the source template to be applied.
     * @param {String} componentName Name of the component.
     * @param {String} deps LESS Dependencies to be added to the styles.
     * @returns {Stream} returns a stream.
     */
    this.buildComponentStyles = function(destFolder, srcTemplate, componentName, deps) {
        return gulp.src(srcTemplate)
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.data(function () {
                return { "componentName": componentName, "dependencies": deps };
            }))
            .pipe(Plugins.template())
            .pipe(Plugins.less())
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(Plugins.rename(componentName + '.css'))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(Plugins.header(Banners.getCSSCopyRight()))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building Component Sample LESS"
                })))
            .pipe(gulp.dest(destFolder))
            .pipe(Plugins.rename(componentName + '.min.css'))
            .pipe(Plugins.cssMinify())
            .pipe(Plugins.header(Banners.getCSSCopyRight()))
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Minifying Component Sample LESS"
                })))
            .pipe(gulp.dest(destFolder));
    }
};

module.exports = new ComponentSamplesHelper();