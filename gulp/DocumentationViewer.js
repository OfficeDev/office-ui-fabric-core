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
//['FabricComponents', 'Documentation', 'Samples'], 
gulp.task('DocumentationViewer', ['Documentation'], function() {
    // List of folders in /dist to display in sidebar in order of presentation
    // var folders = ['Getting Started', 'Components', 'Samples'];
    // var sections = [];

    // for(var x = 0; x < folders.length; x++) {
    //     var subSections = Utilites.getFolders(Config.paths.distDocumentation + '/' + folders[x]);
    //     var pagesOnly;

    //     if (subSections.length < 1) {
    //         subSections = Plugins.fs.readdirSync(Config.paths.distDocumentation + '/' + folders[x]);
    //         subSections = subSections.map(function(fileName) {
    //             fileName = fileName.substr(0, fileName.length - 5);
    //             return (fileName == fileName.toUpperCase()) ? (fileName.charAt(0).toUpperCase() + fileName.slice(1).toLowerCase()) : fileName;
    //         });
    //         pagesOnly = true;
    //     } else {
    //         pagesOnly = false;
    //     }
        
    //     sections.push({
    //         "name": folders[x],
    //         subSections,
    //         pagesOnly
    //     });
    // }

    return gulp.src(Config.paths.srcTemplate + '/documentation-template.html')
        .pipe(Plugins.plumber(ErrorHandling.oneErrorInPipe))
        .pipe(Plugins.debug({
          title: "Building Documentation File to " + Config.paths.distDocumentation
        }))

        // .pipe(Plugins.data(function () {
        //     return { "sections" : sections };
        // }))
        // .pipe(Plugins.template())
        .pipe(Plugins.fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(Plugins.rename('index.html'))
        .pipe(gulp.dest(Config.paths.distDocumentation));
});

// BuildConfig.buildTasks.push('DocumentationViewer');