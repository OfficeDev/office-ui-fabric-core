var gulp = require('gulp');
var fs = require('fs');

var banners = require('./Banners');
var fabricServer = require('./Server');
var config = require('./Config');
var errorHandling = require('./ErrorHandling');
var plugins = require('./Plugins');

var ComponentSamplesHelper = function() {
	
    this.buildComponentStyles = function(destFolder, srcTemplate, componentName, deps) {
        return gulp.src(srcTemplate)
            .pipe(plugins.data(function () {
                return { "componentName": componentName, "dependencies": deps };
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
            .pipe(plugins.rename(componentName + '.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssbeautify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.csscomb())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getCSSCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                    title: "Building Component Sample LESS"
                })))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destFolder))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename(componentName + '.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getCSSCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                    title: "Minifying Component Sample LESS"
                })))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destFolder))
                .on('error', errorHandling.onErrorInPipe);
    }
    
}

module.exports = new ComponentSamplesHelper();