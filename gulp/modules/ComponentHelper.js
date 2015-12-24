var gulp = require('gulp');
var fs = require('fs');

var Banners = require('./Banners');
var Config = require('./Config');
var ErrorHandling = require('./ErrorHandling');
var Plugins = require('./Plugins');

var ComponentSamplesHelper = function() {
	
    this.buildComponentStyles = function(destFolder, srcTemplate, componentName, deps) {
        return gulp.src(srcTemplate)
            .pipe(Plugins.data(function () {
                return { "componentName": componentName, "dependencies": deps };
            }))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.template())
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(Plugins.less())
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
                    title: "Building Component Sample LESS"
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
                    title: "Minifying Component Sample LESS"
                })))
                .on('error', ErrorHandling.onErrorInPipe)
            .pipe(gulp.dest(destFolder))
                .on('error', ErrorHandling.onErrorInPipe);
    }
    
}

module.exports = new ComponentSamplesHelper();