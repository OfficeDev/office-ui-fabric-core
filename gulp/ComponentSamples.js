var gulp = require('gulp');
var fs = require('fs');
var Utilities = require('./modules/Utilities');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var ComponentHelper = require('./modules/ComponentHelper');
var folderList = Utilities.getFolders(Config.paths.componentsPath);

// LESS/SASS detection and logic
var srcPath;
var cssPlugin;
var fileExtension;
var template;

// Check if building SASS
gulp.task('ComponentSamples-configureBuild', function () {
//    if(Config.buildSass) {
        srcPath = Config.paths.srcSass;
        cssPlugin = Plugins.sass;
        fileExtension = '.' + Config.sassExtension;
        template = 'component-manifest-template' + fileExtension;
        name = "SASS";
    // } else {
    //     srcPath = Config.paths.srcLess;
    //     cssPlugin = Plugins.less;
    //     fileExtension = '.' + Config.lessExtension;
    //     template = 'component-manifest-template' + fileExtension;
    //     name = "LESS";
    // }
    return;
});



//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-nuke', function () {
    return Plugins.del.sync([Config.paths.distSamples + '/Components']);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-copyAssets', function() {
    return gulp.src([
            Config.paths.componentsPath + '/**/*.js', 
            Config.paths.componentsPath + '/**/*.jpg', 
            Config.paths.componentsPath + '/**/*.png', 
            Config.paths.componentsPath + '/**/*.js',
            Config.paths.componentsPath + '/**/*.gif'
        ])
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.changed(Config.paths.distSamples + '/Components'))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Copying Component Assets"
                })))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distSamples + '/Components'))
            .on('error', ErrorHandling.onErrorInPipe);
});

//
// Styles tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-buildStyles', ['ComponentSamples-configureBuild'],  function() {
   return folderList.map(function(componentName) {
        var srcTemplate = Config.paths.templatePath + '/'+ template;
        var destFolder = Config.paths.distSampleComponents + '/' + componentName;
        var srcFolderName = Config.paths.componentsPath + '/' + componentName;
        var manifest = Utilities.parseManifest(srcFolderName + '/' + componentName + '.json');
        var deps = manifest.dependencies || [];
        var distFolderName = Config.paths.distSampleComponents + '/' + componentName;
        var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, fileExtension, '.css');
        
        if (hasFileChanged) {
            return ComponentHelper.buildComponentStyles(
                        destFolder, 
                        srcTemplate, 
                        componentName, 
                        deps,
                        cssPlugin,
                        name
                    );
        } else {
            return;
        }

   });
});

//
// Sample Component Building
// ----------------------------------------------------------------------------
gulp.task('ComponentSamples-build', function() {
   var streams = [];
   
   for(var i=0; i < folderList.length; i++) {
       var folderName = folderList[i];
       var srcFolderName = Config.paths.componentsPath + '/' + folderName;
       var distFolderName = Config.paths.distSampleComponents + '/' + folderName;
       var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.html');
       
       if (hasFileChanged) {    
           
           var manifest = Utilities.parseManifest(srcFolderName + '/' + folderName + '.json');
           
           var filesArray = manifest.fileOrder;
           var componentPipe;
           var fileGlob = Utilities.getManifestFileList(filesArray, Config.paths.componentsPath + '/' + folderName);
           var jsFiles = Utilities.getFilesByExtension(srcFolderName, '.js');
           var jsLinks = '';
           
           for (var x = 0; x < jsFiles.length; x++) {
               jsLinks += '<script type="text/javascript" src="' + jsFiles[x] + '"></script>' + "\r\b";
           }
           componentPipe = gulp.src(fileGlob)
           .pipe(Plugins.gulpif(manifest.wrapBranches, Plugins.wrap('<div class="sample-wrapper"><%= contents %></div>')))
                .on('error', ErrorHandling.onErrorInPipe)
           .pipe(Plugins.concat("index.html"))
                .on('error', ErrorHandling.onErrorInPipe)
           .pipe(Plugins.wrap(
                {
                    src:  Config.paths.templatePath + '/componentSampleTemplate.html'  
                },
                {
                    componentName: folderName
                },
                {
                    jsLinks: jsLinks
                }
           ))
                .on('error', ErrorHandling.onErrorInPipe)
           .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building Sample Component " + folderName
                })))
                .on('error', ErrorHandling.onErrorInPipe)
           .pipe(gulp.dest(Config.paths.distSamples + '/Components/' +  folderName))
                .on('error', ErrorHandling.onErrorInPipe);
           
           // Add stream
           streams.push(componentPipe);
       }
   }
   
   if (streams.length > 0) {
       return Plugins.mergeStream(streams);
   } else {
       return;
   }
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

var ComponentSamplesTasks = ['ComponentSamples-configureBuild', 'ComponentSamples-build', 'ComponentSamples-copyAssets', 'ComponentSamples-buildStyles'];

//Build Fabric Component Samples
gulp.task('ComponentSamples', ComponentSamplesTasks);

//
// Fabric Messages
// ----------------------------------------------------------------------------
gulp.task('ComponentSamples-finished', ComponentSamplesTasks, function () {
    console.log(ConsoleHelper.generateSuccess(Config.componentSamplesFinished, true));
});

gulp.task('ComponentSamples-updated', ComponentSamplesTasks, function () {
    console.log(ConsoleHelper.generateSuccess(Config.componentSamplesUpdate));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components but, builds the samples only
gulp.task('ComponentSamples-watch', ['ComponentSamples'], function () {
    return gulp.watch(Config.paths.componentsPath + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence('ComponentSamples', 'ComponentSamples-updated', done);
    }));
});