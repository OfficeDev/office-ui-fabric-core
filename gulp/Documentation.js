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
var reload = require('require-reload')(require);
var BuildConfig = require('./modules/BuildConfig');

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
        Config.paths.srcDocsPages + '/**/*.jpg', 
        Config.paths.srcDocsPages + '/**/*.png',
        Config.paths.srcDocsPages + '/**/*.gif',
        Config.paths.srcDocsPages + '/**/*.svg'
    ];

    return gulp.src(paths)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Copying Component Assets"
            })))
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.changed(Config.paths.distDocsComponents))
        .pipe(gulp.dest(Config.paths.distDocsComponents));
});

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
    
    if (fs.existsSync(_srcFolderName)) {
        Config.handleBarsConfig.batch.push('./' + _srcFolderName);
    }
   }
   
   cb();
});

gulp.task('Documentation-template', ["Documentation-handlebars"], function(cb) {
  var _template = new Template(folderList, Config.paths.distJS, Config.paths.componentsPath, function() {
    gulp.src(Config.paths.distJS + "/fabric.templates.ts")
    .pipe(Plugins.header(Banners.getJSCopyRight()))
    .pipe(Plugins.tsc(Config.typescriptProject))
    .js.pipe(gulp.dest(Config.paths.distJS))
    .on('end', function() {
      cb();
    });
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
       templateData,
       exampleModels;
       
   var demoPagesList = Utilities.getFolders(Config.paths.srcDocsPages);
  
   for (var i=0; i < demoPagesList.length; i++) {
       
       templateData = {};
       pageName = demoPagesList[i];
       var exampleModels = [];
       
       // Current Page Folder path
       srcFolderName = Config.paths.srcDocsPages + '/' + pageName;
       
       // Current Page example folder path
       exampleFolderName = srcFolderName + '/' + Config.paths.srcDocsPagesExamples;
       
       // Dist folder name for page
       distFolderName = Config.paths.distDocumentation + '/' + pageName;
     
       try {
        fs.statSync(exampleFolderName);
        exampleModels = Utilities.getFilesByExtension(exampleFolderName, '.js');
       } catch (err) {}
       
       
       // Go through and find the view model for each example handlebars file and store in context
        if(exampleModels.length > 0) {
            for(var x = 0; x < exampleModels.length; x++) {
                var file = exampleModels[x];
                var modelName = file.replace('.js', '');
                modelName = modelName.replace(" ", '');
                var modelFile = reload('../' + exampleFolderName + '/' + file);
                templateData[modelName] = modelFile;
               
            }
        }

       hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.md', '.html');
       
        // if (hasFileChanged) {
           
           // Get markdown File
           markdown = srcFolderName + '/' + pageName + '.md';
           componentPipe = gulp.src(markdown)
           .pipe(Plugins.plumber(ErrorHandling.oneErrorInPipe))
           .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Building documentation page " + pageName
            })))
           .pipe(Plugins.marked())
           .on('error', function(err) {
              console.log(err);  
            })
           .pipe(Plugins.fileinclude())
           .pipe(Plugins.replace("<!---", ""))
           .pipe(Plugins.replace("--->", ""))
           .pipe(Plugins.handlebars(templateData, Config.handleBarsConfig))
           .pipe(Plugins.replace(Banners.getHTMLCopyRight(), ""))
           .pipe(Plugins.prettify({indent_char: ' ', indent_size: 2}))
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
           .pipe(gulp.dest(Config.paths.distDocsComponents + '/' + pageName));
           
           // Add stream
           streams.push(componentPipe);
      // }
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
    'ComponentJS',
    'Documentation-copyIgnoredFiles',
    "Documentation-template"
];

//Build Fabric Component Samples
gulp.task('Documentation', DocumentationTasks);
BuildConfig.buildTasks.push('Documentation');
BuildConfig.nukeTasks.push('Documentation-nuke');