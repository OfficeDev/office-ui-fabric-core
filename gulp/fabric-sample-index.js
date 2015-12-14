var gulp = require('gulp');
var config = require('./config');
var errorHandling = require('./errorHandling');
var componentsPageHelper = require('./components-page-helpers');
var plugins = require('./plugins');

var samplesLinks = "";
var componentLinks = [];

//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('build-components-page', ['clean-samples', 'build-component-data', 'build-sample-data'], function() {
    return gulp.src(config.paths.templatePath + '/'+ 'samples-index.html')
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.data(function () {
        return { "components": componentsPageHelper.buildLinkContainer(componentLinks.sort().join('')), "samples" :  componentsPageHelper.buildLinkContainer(samplesLinks)};
    }))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.template())
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.rename('index.html'))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(gulp.dest(config.paths.distSamples))
        .on('error', errorHandling.onErrorInPipe);
});
