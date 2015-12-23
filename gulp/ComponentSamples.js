var gulp = require('gulp');
var fs = require('fs');
var utilities = require('./modules/Utilities');
var config = require('./modules/Config');
var messaging = require('./modules/Messaging');
var errorHandling = require('./modules/ErrorHandling');
var plugins = require('./modules/Plugins');
var ComponentHelper = require('./modules/ComponentHelper');
var folderList = utilities.getFolders(config.paths.componentsPath);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-nuke', function () {
    return plugins.del.sync([config.paths.distSamples + '/Components']);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-copyAssets', function() {
    return gulp.src([
            config.paths.componentsPath + '/**/*.js', 
            config.paths.componentsPath + '/**/*.jpg', 
            config.paths.componentsPath + '/**/*.png', 
            config.paths.componentsPath + '/**/*.js',
            config.paths.componentsPath + '/**/*.gif'
        ])
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.changed(config.paths.distSamples + '/Components'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                    title: "Copying Component Assets"
                })))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distSamples + '/Components'))
            .on('error', errorHandling.onErrorInPipe);
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-less',  function() {
   return folderList.map(function(componentName) {

        var manifest = utilities.parseManifest(componentName);
        var deps = manifest.dependencies || [];
        var srcTemplate = config.paths.templatePath + '/'+ 'component-manifest-template.less';
        var destFolder = config.paths.distSampleComponents + '/' + componentName;
        var srcFolderName = config.paths.componentsPath + '/' + componentName;
        var distFolderName = config.paths.distSampleComponents + '/' + componentName;
        var hasFileChanged = utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.less', '.css');
        
        if(hasFileChanged) {
            return ComponentHelper.buildComponentStyles(destFolder, srcTemplate, componentName, deps);
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
       var srcFolderName = config.paths.componentsPath + '/' + folderName;
       var distFolderName = config.paths.distSampleComponents + '/' + folderName;
       var hasFileChanged = utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.html');
       
       if(hasFileChanged) {    
           var manifest = utilities.parseManifest(folderName);
           var filesArray = manifest.fileOrder;
           var componentPipe;
           var fileGlob = utilities.getManifestFileList(filesArray, config.paths.componentsPath + '/' + folderName);
           var jsFiles = utilities.getFilesByExtension(srcFolderName, '.js');
           var jsLinks = '';
           
           for(var x = 0; x < jsFiles.length; x++) {
               jsLinks += '<script type="text/javascript" src="' + jsFiles[x] + '"></script>' + "\r\b";
           }
           componentPipe = gulp.src(fileGlob)
           .pipe(plugins.gulpif(manifest.wrapBranches, plugins.wrap('<div class="sample-wrapper"><%= contents %></div>')))
                .on('error', errorHandling.onErrorInPipe)
           .pipe(plugins.concat("index.html"))
                .on('error', errorHandling.onErrorInPipe)
           .pipe(plugins.wrap(
                {
                    src:  config.paths.templatePath + '/componentSampleTemplate.html'  
                },
                {
                    componentName: folderName
                },
                {
                    jsLinks: jsLinks
                }
           ))
                .on('error', errorHandling.onErrorInPipe)
           .pipe(plugins.debug(
                {
                    title: folderName
                }
           ))
                .on('error', errorHandling.onErrorInPipe)
           .pipe(gulp.dest(config.paths.distSamples + '/Components/' +  folderName))
                .on('error', errorHandling.onErrorInPipe);
           
           // Add stream
           streams.push(componentPipe);
       }
   }
   
   if(streams.length > 0) {
       return plugins.mergeStream(streams);
   } else {
       return;
   }
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

var ComponentSamplesTasks = ['ComponentSamples-build', 'ComponentSamples-copyAssets', 'ComponentSamples-less'];

//Build Fabric Component Samples
gulp.task('ComponentSamples', ComponentSamplesTasks);

//
// Fabric Messages
// ----------------------------------------------------------------------------
gulp.task('ComponentSamples-finished', ComponentSamplesTasks, function () {
    console.log(messaging.generateSuccess(config.componentSamplesFinished, true));
});

gulp.task('ComponentSamples-updated', ComponentSamplesTasks, function () {
    console.log(messaging.generateSuccess(config.componentSamplesUpdate));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components but, builds the samples only
gulp.task('ComponentSamples-watch', ['ComponentSamples'], function () {
    return gulp.watch(config.paths.componentsPath + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('ComponentSamples', 'ComponentSamples-updated', done);
    }));
});