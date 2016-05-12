var gulp = require('gulp');
var fs = require('fs');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var ComponentHelper = require('./modules/ComponentHelper');
var folderList = Utilities.getFolders(Config.paths.componentsPath);
// var Template = require('./modules/Template');

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-nuke', function () {
    return Plugins.del.sync([Config.paths.distSamples + '/Components']);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-copyIgnoredFiles', function() {
    return Config.ignoreComponentJSLinting.map(function(element) {
        var src = element.src;
        var dist = element.dist;
        return gulp.src(src)
            .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Copying Ignored Files"
            })))
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.changed(dist))
            .pipe(gulp.dest(dist));
    });
});

gulp.task('ComponentSamples-copyAssets', function() {
    var paths = [
        Config.paths.componentsPath + '/**/*.jpg', 
        Config.paths.componentsPath + '/**/*.png',
        Config.paths.componentsPath + '/**/*.gif'
    ];

    return gulp.src(paths)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Copying Component Assets"
            })))
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.changed(Config.paths.distSamples + '/Components'))
        .pipe(gulp.dest(Config.paths.distSamples + '/Components'));
});


gulp.task('ComponentSamples-styleHinting',  function() {
   return gulp.src(Config.paths.componentsPath + '/**/*.scss')
      .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
      .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
          title: "Checking SASS Compile errors and linting"
      })))
     .pipe(Plugins.sasslint())
     .pipe(ErrorHandling.SASSlintErrors());

 });

//
// Styles tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-buildStyles', function() {
   return folderList.map(function(componentName) {
        var srcTemplate = Config.paths.templatePath + '/'+ BuildConfig.template;
        var destFolder = Config.paths.distSampleComponents + '/' + componentName;
        var srcFolderName = Config.paths.componentsPath + '/' + componentName;
        var manifest = Utilities.parseManifest(srcFolderName + '/' + componentName + '.json');
        var deps = manifest.dependencies || [];
        var distFolderName = Config.paths.distSampleComponents + '/' + componentName;
        var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.' + BuildConfig.fileExtension, '.css');
        
        if (hasFileChanged) {
            return ComponentHelper.buildComponentStyles(
                        destFolder, 
                        srcTemplate, 
                        componentName, 
                        deps,
                        BuildConfig.processorPlugin,
                        BuildConfig.processorName,
                        BuildConfig.compileErrorHandler
                    );
        } else {
            return;
        }

   });
});

gulp.task('ComponentSamples-handlebars', function(cb) {
   //Get components for Handlebar
   Config.handleBarsConfig.batch = [];
    for(var i=0; i < folderList.length; i++) {
       var folderName = folderList[i];
       var srcFolderName = Config.paths.componentsPath + '/' + folderName;
       // Push to Handlebars config
       Config.handleBarsConfig.batch.push('./' + srcFolderName);
       
    }
    cb();
});

gulp.task('ComponentSamples-template', function(cb) {
  var _template = new Template(folderList, Config.paths.distJS, Config.paths.componentsPath, function() {
    cb();
  }.bind(this));
});

//
// Sample Component Building
// ----------------------------------------------------------------------------
gulp.task('ComponentSamples-build', ['ComponentSamples-handlebars'], function() {
   var streams = [];
  
   for(var i=0; i < folderList.length; i++) {
       var folderName = folderList[i];
       var srcFolderName = Config.paths.componentsPath + '/' + folderName;
       var distFolderName = Config.paths.distSampleComponents + '/' + folderName;
       var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.md');
       hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.json');
       
       if (hasFileChanged) {
           var manifest = Utilities.parseManifest(srcFolderName + '/' + folderName + '.json');
           var filesArray = manifest.fileOrder;
           var componentPipe;
           //var fileGlob = Utilities.getManifestFileList(filesArray, Config.paths.componentsPath + '/' + folderName);
           var markdown = srcFolderName + '/' + folderName + '.md';
           
           componentPipe = gulp.src(markdown)
           .pipe(Plugins.plumber(ErrorHandling.oneErrorInPipe))
           .pipe(Plugins.fileinclude())
           .pipe(Plugins.handlebars(manifest, Config.handleBarsConfig))
           .pipe(Plugins.markdown())
           .pipe(Plugins.rename("index.html"))
           .pipe(Plugins.wrap(
                {
                    src:  Config.paths.templatePath + '/componentSampleTemplate.html'  
                },
                {
                    componentName: folderName
                }
           ))
           .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building Sample Component " + folderName
                })))
           .pipe(gulp.dest(Config.paths.distSamples + '/Components/' +  folderName));
           
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

var ComponentSamplesTasks = [
    'ComponentSamples-build', 
    'ComponentSamples-copyAssets',
    'ComponentSamples-styleHinting',
    'ComponentSamples-buildStyles',
    'ComponentJS',
    'ComponentSamples-copyIgnoredFiles'
];

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