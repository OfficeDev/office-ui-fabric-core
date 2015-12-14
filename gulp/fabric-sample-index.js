var gulp = require('gulp');

var banners = require('./modules/Banners');
var config = require('./modules/Config');
var errorHandling = require('./modules/ErrorHandling');
var plugins = require('./modules/Plugins');
var ComponentsPageHelper = require('./modules/ComponentsPageHelpers');

var samplesLinks = "";
var componentLinks = [];

//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('build-components-page', ['clean-samples', 'build-component-data', 'build-sample-data'], function() {
    return gulp.src(config.paths.templatePath + '/'+ 'samples-index.html')
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.data(function () {
        return { "components": ComponentsPageHelper.buildLinkContainer(componentLinks.sort().join('')), "samples" :  ComponentsPageHelper.buildLinkContainer(samplesLinks)};
    }))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.template())
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.rename('index.html'))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(gulp.dest(config.paths.distSamples))
        .on('error', errorHandling.onErrorInPipe);
});
