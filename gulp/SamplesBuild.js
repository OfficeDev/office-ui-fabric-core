var gulp = require('gulp');

var Utilites = require('./modules/Utilities');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
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

gulp.task('Samples-buildStyles',  function () {
    // Build minified Fabric Components CSS for each Component.
    return folderList.map(function(folder) {
        return gulp.src(Config.paths.srcSamples + '/' + folder + '/' + BuildConfig.processorName +'/' + folder + '.' + BuildConfig.fileExtension)
                .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
                .pipe(Plugins.changed(Config.paths.distSamples + '/' + folder + '/css', {extension: '.css'}))
                .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                           title: "Building Sample " + BuildConfig.processorName +" for " + folder
                 })))
                .pipe(BuildConfig.processorPlugin().on('error', BuildConfig.compileErrorHandler))
                    .on('error', ErrorHandling.onErrorInPipe)
                .pipe(Plugins.autoprefixer({
                    browsers: ['last 2 versions', 'ie >= 9'],
                    cascade: false
                }))
                .pipe(Plugins.rename(folder + '.css'))
                .pipe(Plugins.cssbeautify())
                .pipe(Plugins.csscomb())
                .pipe(gulp.dest(Config.paths.distSamples + '/' + folder + '/css'))
                .pipe(Plugins.rename(folder + '.min.css'))
                .pipe(Plugins.cssMinify())
                .pipe(gulp.dest(Config.paths.distSamples + '/' + folder + '/css'));
    });
});


// Roll up for samples
gulp.task('Samples', ['Samples-copyAssets', 'Samples-buildStyles']);

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