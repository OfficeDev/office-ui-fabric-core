var gulp = require('gulp');
var Utilites = require('./modules/Utilities');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var BuildConfig = require('./modules/BuildConfig');

//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('DocumentationViewer', ['Fabric', 'FabricComponents', 'Documentation', 'Samples'], function() {
    var sections = [];
    var getDocsFolders = Utilites.getFolders(Config.paths.distDocumentation);
    
    for(var x = 0; x < getDocsFolders.length; x++) {
        var folderName = getDocsFolders[x];
        var subSections = Utilites.getFolders(Config.paths.distDocumentation + '/' + folderName);
        
        sections.push({
            "name": folderName,
            "subSections":  subSections
        });
    }

    return gulp.src(Config.paths.srcTemplate + '/'+ 'samples-index.html')
        .pipe(Plugins.plumber(ErrorHandling.oneErrorInPipe))
        .pipe(Plugins.data(function () {
            return { "sections" : sections };
        }))
        .pipe(Plugins.template())
        .pipe(Plugins.rename('index.html'))
        .pipe(gulp.dest(Config.paths.distDocumentation));
});

BuildConfig.buildTasks.push('DocumentationViewer');