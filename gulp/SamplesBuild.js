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
    return Plugins.del.sync(Config.paths.distDocsSamples + '/*');
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('Samples-copyAssets', function () {
    // Copy all samples files.
    return gulp.src(Config.paths.srcSamples + '/**')
        .pipe(Plugins.changed(Config.paths.distDocsSamples))
            .on('error', ErrorHandling.onErrorInPipe)
         .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
            title: "Moving All Sample Assets"
         })))
        .pipe(gulp.dest(Config.paths.distDocsSamples));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('Samples-buildStyles',  function () {
    // Build minified Fabric Components CSS for each Component.
    return folderList.map(function(folder) {
        return gulp.src(Config.paths.srcSamples + '/' + folder + '/' + BuildConfig.processorName +'/' + folder + '.' + BuildConfig.fileExtension)
                .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
                .pipe(Plugins.changed(Config.paths.distDocsSamples + '/' + folder + '/css', {extension: '.css'}))
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
                .pipe(gulp.dest(Config.paths.distDocsSamples + '/' + folder + '/css'))
                .pipe(Plugins.rename(folder + '.min.css'))
                .pipe(Plugins.cssMinify())
                .pipe(gulp.dest(Config.paths.distDocsSamples + '/' + folder + '/css'));
    });
});


// Roll up for samples
gulp.task('Samples', ['Samples-copyAssets', 'Samples-buildStyles']);
BuildConfig.buildTasks.push('Samples');
BuildConfig.nukeTasks.push('Samples-nuke');