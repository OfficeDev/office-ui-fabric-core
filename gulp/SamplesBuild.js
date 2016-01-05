var gulp = require('gulp');

var Utilites = require('./modules/Utilities');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var folderList = Utilites.getFolders(Config.paths.srcSamples);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------


gulp.task('Samples-nuke', function () {
    return Plugins.del.sync([Config.paths.distSamples + '/*', '!' + Config.paths.distSamples + '/{Components, Components/**}']);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('Samples-copyAssets', function () {
    // Copy all samples files.
    return gulp.src(Config.paths.srcSamples + '/**')
        .pipe(Plugins.changed(Config.paths.distSamples))
            .on('error', ErrorHandling.onErrorInPipe)
         .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
            title: "Moving All Sample Assets"
         })))
        .pipe(gulp.dest(Config.paths.distSamples));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('Samples-buildLess', function () {
    // Build minified Fabric Components CSS for each Component.
    return folderList.map(function(folder) {
        return gulp.src(Config.paths.srcSamples + '/' + folder + '/less/' + folder + '.less')
                .pipe(Plugins.changed(Config.paths.distSamples + '/' + folder + '/css', {extension: '.css'}))
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                           title: "Building Sample LESS for " + folder
                 })))
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(Plugins.less())
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(Plugins.autoprefixer({
                    browsers: ['last 2 versions', 'ie >= 9'],
                    cascade: false
                }))
                .pipe(Plugins.rename(folder + '.css'))
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(Plugins.cssbeautify())
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(Plugins.csscomb())
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(gulp.dest(Config.paths.distSamples + '/' + folder + '/css'))
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(Plugins.rename(folder + '.min.css'))
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(Plugins.cssMinify())
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(gulp.dest(Config.paths.distSamples + '/' + folder + '/css'))
                    .on('error', ErrorHandling.onErrorInPipe);
    });
});


// Roll up for samples
gulp.task('Samples', ['Samples-copyAssets', 'Samples-buildLess']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('Samples-finished', ['Samples'], function () {
    console.log(ConsoleHelper.generateSuccess('Samples done, experience fabric by sample!', true));
});

gulp.task('Samples-updated', ['Samples'], function () {
    console.log(ConsoleHelper.generateSuccess(' Samples done updating', false));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch and build Fabric when sources change.
gulp.task('Samples-watch', ['Samples', 'Samples-finished'], function () {
    return gulp.watch(Config.paths.srcSamples + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence('Samples', 'Samples-updated', done);
    }));
});