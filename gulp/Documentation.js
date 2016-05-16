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
var demoPagesList = Utilities.getFolders(Config.paths.srcDocsPages);
var Template = require('./modules/Template');
var pandoc = require('gulp-pandoc');

require("typescript-require")({
    exitOnError: true
});

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('Documentation-nuke', function () {
    return Plugins.del.sync([Config.paths.distDocsComponents]);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('Documentation-copyIgnoredFiles', function() {
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

gulp.task('Documentation-copyAssets', function() {
    var paths = [
        Config.paths.componentsPath + '/**/*.jpg', 
        Config.paths.componentsPath + '/**/*.png',
        Config.paths.componentsPath + '/**/*.gif',
        Config.paths.componentsPath + '/**/*.svg'
    ];

    return gulp.src(paths)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Copying Component Assets"
            })))
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.changed(Config.paths.distDocsComponents))
        .pipe(gulp.dest(Config.paths.distDocsComponents));
});


gulp.task('Documentation-styleHinting',  function() {
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

// gulp.task('Documentation-buildStyles', function() {
//    return folderList.map(function(componentName) {
//         var srcTemplate = Config.paths.templatePath + '/'+ BuildConfig.template;
//         var destFolder = Config.paths.distSampleComponents + '/' + componentName;
//         var srcFolderName = Config.paths.componentsPath + '/' + componentName;
//         var manifest = Utilities.parseManifest(srcFolderName + '/' + componentName + '.json');
//         var deps = manifest.dependencies || [];
//         var distFolderName = Config.paths.distSampleComponents + '/' + componentName;
//         var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.' + BuildConfig.fileExtension, '.css');
        
//         if (hasFileChanged) {
//             return ComponentHelper.buildComponentStyles(
//                         destFolder, 
//                         srcTemplate, 
//                         componentName, 
//                         deps,
//                         BuildConfig.processorPlugin,
//                         BuildConfig.processorName,
//                         BuildConfig.compileErrorHandler
//                     );
//         } else {
//             return;
//         }

//    });
// });

gulp.task('Documentation-handlebars', function(cb) {
   var _folderName;
   var _srcFolderName;
   var _demoPageComponents;
   
   // Reset current batch
   Config.handleBarsConfig.batch = [];
   
   // Get all components partials first
   for (var i = 0; i < folderList.length; i++) {
    _folderName = folderList[i];
    _srcFolderName = Config.paths.componentsPath + '/' + _folderName;
    // Push to Handlebars config
    Config.handleBarsConfig.batch.push('./' + _srcFolderName);
   }
    
   // Next get all example partials inside of the pages folders
   for (var i = 0; i < demoPagesList.length; i++) {
    _folderName = demoPagesList[i];
    _srcFolderName = Config.paths.srcDocsPages + '/' + _folderName + '/' + Config.paths.srcDocsPagesExamples;
    
    // Push to Handlebars config
    Config.handleBarsConfig.batch.push('./' + _srcFolderName);
   }
   
   cb();
});

gulp.task('Documentation-template', ["Documentation-handlebars"], function(cb) {
  var _template = new Template(folderList, Config.paths.distJS, Config.paths.componentsPath, function() {
    cb();
  }.bind(this));
  _template.init();
});

//
// Sample Component Building
// ----------------------------------------------------------------------------
gulp.task('Documentation-build', ['Documentation-handlebars'], function() {
   var streams = [],
       pageName,
       srcFolderName,
       distFolderName,
       hasFileChanged,
       manifest,
       filesArray,
       componentPipe,
       markdown,
       templateData;
       
   var demoPagesList = Utilities.getFolders(Config.paths.srcDocsPages);
  
   for (var i=0; i < demoPagesList.length; i++) {
       
       templateData = {};
       pageName = demoPagesList[i];
       
       // Current Page Folder path
       srcFolderName = Config.paths.srcDocsPages + '/' + pageName;
       
       // Current Page example folder path
       exampleFolderName = srcFolderName + '/' + Config.paths.srcDocsPagesExamples;
       
       // Dist folder name for page
       distFolderName = Config.paths.distDocumentation + '/' + pageName;
       
       // Load all available example models into templateData
       var exampleModels = Utilities.getFilesByExtension(exampleFolderName, '.js');
       
     
       // Go through and find the view model for each example handlebars file and store in context
       if(exampleModels.length > 0) {
           console.log(exampleModels);
           for(var x = 0; x < exampleModels.length; x++) {
               console.log("ayy lmao"); 
               var file = exampleModels[x];
               var modelName = file.replace('.js', ' ');
               var modelFile = require('../' + exampleFolderName + '/' + file);
               templateData[modelName] = modelFile;
           }
       }
       
       console.log(templateData);
       
       hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.md', '.html');

       //Go through each page
        // For each page
            // Load all examples models
            // Build markdown and pass in example Models
       
       if (hasFileChanged) {
           
           // Get Manifest
           // manifest = Utilities.parseManifest(srcFolderName + '/' + pageName + '.json');
           
           // Get markdown File
           markdown = srcFolderName + '/' + pageName + '.md';
           
           componentPipe = gulp.src(markdown)
           .pipe(Plugins.plumber(ErrorHandling.oneErrorInPipe))
           .pipe(pandoc({
                from: 'markdown',
                to: 'html5',
                ext: '.html',
                args: ['--smart']
            }))
           .pipe(Plugins.fileinclude())
           .pipe(Plugins.replace("<!---", ""))
           .pipe(Plugins.replace("--->", ""))
           .pipe(Plugins.handlebars(templateData, Config.handleBarsConfig))
           .pipe(Plugins.rename("index.html"))
           .pipe(Plugins.wrap(
                {
                    src:  Config.paths.srcTemplate + '/componentDemo.html'  
                },
                {
                    pageName: pageName
                }
           ))
           // Replace Comments to hide code
           
           .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Building documentation page " + pageName
                })))
           .pipe(gulp.dest(Config.paths.distDocsComponents + '/' + pageName));
           
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

var DocumentationTasks = [
    'Documentation-build', 
    'Documentation-copyAssets',
    'Documentation-styleHinting',
    // 'Documentation-buildStyles',
    'ComponentJS',
    'Documentation-copyIgnoredFiles',
    "Documentation-template"
];

//Build Fabric Component Samples
gulp.task('Documentation', DocumentationTasks);

//
// Fabric Messages
// ----------------------------------------------------------------------------
gulp.task('Documentation-finished', DocumentationTasks, function () {
    console.log(ConsoleHelper.generateSuccess(Config.DocumentationFinished, true));
});

gulp.task('Documentation-updated', DocumentationTasks, function () {
    console.log(ConsoleHelper.generateSuccess(Config.DocumentationUpdate));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components but, builds the samples only
gulp.task('Documentation-watch', ['Documentation'], function () {
    return gulp.watch(Config.paths.componentsPath + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence('Documentation', 'Documentation-updated', done);
    }));
});