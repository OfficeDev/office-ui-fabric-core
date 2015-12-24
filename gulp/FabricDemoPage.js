var gulp = require('gulp');

var Utilites = require('./modules/Utilities');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var folderList = Utilites.getFolders(Config.paths.srcSamples);

var samplesLinks = "";
var componentLinks = [];

//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('FabricDemoPage', function() {
   
    var getComponentFolders = Utilites.getFolders(Config.paths.distSampleComponents);
    var getSamplesFolders =  Utilites.getFolders(Config.paths.distSamples);
    
    return gulp.src(Config.paths.templatePath + '/'+ 'samples-index.html')
        .on('error', ErrorHandling.onErrorInPipe)
    .pipe(Plugins.data(function () {
        return { 
                    "components" : getComponentFolders, 
                    "samples": getSamplesFolders
               };
    }))
        .on('error', ErrorHandling.onErrorInPipe)
    .pipe(Plugins.template())
        .on('error', ErrorHandling.onErrorInPipe)
    .pipe(Plugins.rename('index.html'))
        .on('error', ErrorHandling.onErrorInPipe)
    .pipe(gulp.dest(Config.paths.distSamples))
        .on('error', ErrorHandling.onErrorInPipe);
});
