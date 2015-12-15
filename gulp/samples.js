var gulp = require('gulp');

var utilities = require('./modules/Utilities');
var banners = require('./modules/Banners');
var fabricServer = require('./modules/Server');
var config = require('./modules/Config');
var messaging = require('./modules/Messaging');
var errorHandling = require('./modules/ErrorHandling');
var plugins = require('./modules/Plugins');
var componentPageHelpers = require('./modules/ComponentsPageHelpers');

var storedFiles = {};


// Component parts
var componentsFolders = utilities.getFolders(config.paths.componentsPath);
var catalogContents = "";
var componentLinks = [];
var samplesLinks = "";
var samplesFolders = utilities.getFolders(config.paths.srcSamples);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------


gulp.task('clean-samples', function () {
    return plugins.del.sync([config.paths.distSamples + '/*', '!' + config.paths.distSamples + '/{Components, Components/**}']);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('copy-samples', ['clean-samples'], function () {
    // Copy all samples files.
    return gulp.src('src/samples/**')
        .pipe(gulp.dest(config.paths.distSamples));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('samples-less', ['clean-samples'], function () {

    // Build minified Fabric Components CSS for each Component.
    return samplesFolders.map(function(folder) {

        return gulp.src(config.paths.srcSamples + '/' + folder + '/less/' + folder + '.less')
            .pipe(plugins.less())
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
            .pipe(gulp.dest(config.paths.distSamples + '/' + folder + '/css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename(folder + '.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distSamples + '/' + folder + '/css'))
                .on('error', errorHandling.onErrorInPipe);
    });
});

//
// Sample Component Building
// ----------------------------------------------------------------------------

gulp.task('reset-sample-data', function() {
    samplesLinks = '';
    samplesFolders = plugins.getFolders(config.paths.srcSamples);
});

gulp.task('build-sample-data', ['clean-samples'], plugins.folders(config.paths.srcSamples, function (folder) {
    return gulp.src(config.paths.srcSamples + '/' +  folder).pipe(plugins.tap(function() {
            samplesLinks += componentPageHelpers.buildLinkHtml(folder, folder);
    }));
}));


//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('build-components-page', ['clean-samples', 'build-component-data', 'build-sample-data'], function() {
    return gulp.src(config.paths.templatePath + '/'+ 'samples-index.html')
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.data(function () {
        return { "components": componentPageHelpers.buildLinkContainer(componentLinks.sort().join('')), "samples" :  componentPageHelpers.buildLinkContainer(samplesLinks)};
    }))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.template())
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.rename('index.html'))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(gulp.dest(config.paths.distSamples))
        .on('error', errorHandling.onErrorInPipe);
}); 


// Roll up for samples
gulp.task('build-samples', ['clean-samples', 'copy-samples', 'samples-less']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('samples-finished', ['build-samples'], function () {
    console.log(messaging.generateSuccess('Samples done, experience fabric by sample!', true));
});

gulp.task('samples-updated', ['build-samples'], function () {
    console.log(messaging.generateSuccess(' Samples done updating', false));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch and build Fabric when sources change.
gulp.task('watch:samples', ['build-samples', 'samples-finished'], function () {
    return gulp.watch(config.paths.srcSamples + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('build-samples', 'samples-updated', done);
    }));
});