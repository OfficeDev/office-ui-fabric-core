var gulp = require('gulp');

var utilities = require('./modules/Utilities');
var config = require('./modules/Config');
var messaging = require('./modules/Messaging');
var errorHandling = require('./modules/ErrorHandling');
var plugins = require('./modules/Plugins');
var folderList = utilities.getFolders(config.paths.srcSamples);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------


gulp.task('Samples-nuke', function () {
    return plugins.del.sync([config.paths.distSamples + '/*', '!' + config.paths.distSamples + '/{Components, Components/**}']);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('Samples-copyAssets', function () {
    // Copy all samples files.
    return gulp.src(config.paths.srcSamples + '/**')
        .pipe(plugins.changed(config.paths.distSamples))
            .on('error', errorHandling.onErrorInPipe)
         .pipe(plugins.gulpif(config.debugMode, plugins.debug({
            title: "Moving All Sample Assets"
         })))
        .pipe(gulp.dest(config.paths.distSamples));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('Samples-buildLess', function () {
    // Build minified Fabric Components CSS for each Component.
    return folderList.map(function(folder) {
        return gulp.src(config.paths.srcSamples + '/' + folder + '/less/' + folder + '.less')
                .pipe(plugins.changed(config.paths.distSamples + '/' + folder + '/css', {extension: '.css'}))
                    .on('error', errorHandling.onErrorInPipe)
                .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                           title: "Building Sample LESS for " + folder
                 })))
                    .on('error', errorHandling.onErrorInPipe)
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


// Roll up for samples
gulp.task('Samples', ['Samples-copyAssets', 'Samples-buildLess']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('Samples-finished', ['Samples'], function () {
    console.log(messaging.generateSuccess('Samples done, experience fabric by sample!', true));
});

gulp.task('Samples-updated', ['Samples'], function () {
    console.log(messaging.generateSuccess(' Samples done updating', false));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch and build Fabric when sources change.
gulp.task('Samples-watch', ['Samples', 'Samples-finished'], function () {
    return gulp.watch(config.paths.srcSamples + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('Samples', 'Samples-updated', done);
    }));
});