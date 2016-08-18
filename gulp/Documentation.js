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
// var Template = require('./modules/Template');
var reload = require('require-reload')(require);
var BuildConfig = require('./modules/BuildConfig');




var filePath = '';
var build = '';
var handlebars = require('gulp-compile-handlebars');
var jsonData = [];
var templateData,
    hbsoptions = {
      ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
      partials : {},
      batch : [Config.paths.srcDocTemplateModulesComponents],
      helpers : {}
    }

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('Documentation-nuke', function () {
    return Plugins.del.sync([Config.paths.distDocumentation]);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------


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

gulp.task('Documentation-buildStyles', function () {
    return gulp.src(Config.paths.srcDocumentationCSS + '/' + 'docs.scss')
            .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(Plugins.debug({
              title: "Building Documentation SASS " + BuildConfig.fileExtension + " File"
            }))
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(BuildConfig.processorPlugin().on('error', BuildConfig.compileErrorHandler))
            .pipe(Plugins.rename('docs.css'))
            // .pipe(Plugins.changed(Config.paths.distDocumentationCSS, {extension: '.css'}))
            .pipe(Plugins.autoprefixer({
              browsers: ['last 2 versions', 'ie >= 9'],
              cascade: false
            }))
            .pipe(Plugins.cssbeautify())
            .pipe(Plugins.csscomb())
            .pipe(gulp.dest(Config.paths.distDocumentationCSS))
            .pipe(Plugins.rename('docs.min.css'))
            .pipe(Plugins.cssMinify())
            .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
            .pipe(gulp.dest(Config.paths.distDocumentationCSS));
});


gulp.task('Documentation-convertMarkdown', function() {
  return gulp.src('./ghdocs/*.md')
          .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
          .pipe(Plugins.debug({
            title: "Building Getting Started Documentation"
          }))
          .pipe(Plugins.marked())
          .pipe(Plugins.wrap(
              {
                  src:  Config.paths.srcTemplate + '/gettingStartedTemplate.html'  
              },
              {
                  pageName: 'Getting Started Page'
              }
         ))
          .pipe(gulp.dest(Config.paths.distDocsGettingStarted))
          
});


// Prepare handlebar variables
gulp.task('prepare-handlebars', function(cb) {
  var modelFiles = fs.readdirSync(Config.paths.srcDocumentationModels);
  // var partialFiles = fs.readdirSync('./src/modules/components/')
  var jsonfile;
  var jsonFileName;
  var modelFile;
  var modelFileName;

  for (var i = 0; i < modelFiles.length; i++) {
    jsonFile = fs.readFileSync(Config.paths.srcDocumentationModels + '/' + modelFiles[i], 'utf8');
    jsonFileName = modelFiles[i].replace('.json', '');
    jsonData[jsonFileName] = JSON.parse(jsonFile);
  }
  templateData = jsonData;
  cb();
});

// Build template files in /src/**/*.html
gulp.task('Documentation-pages', ['prepare-handlebars'], function () {
  return gulp.src("./src/documentation/pages/**/index.html")
      .pipe(Plugins.plumber(ErrorHandling.oneErrorInPipe))
      .pipe(Plugins.debug({
        title: "Building Documentation Page File to " + Config.paths.distDocumentation
      }))
      .pipe(handlebars(templateData, hbsoptions))
      .pipe(Plugins.fileinclude({
        context: {
          filePath: filePath,
          build: build
        }
      }))
      // .pipe(Plugins.fileinclude({
      //   context: {
      //     filePath: filePath,
      //     build: build
      //   }
      // }))
      // .pipe(replace(/undefined/g, ''))
      .pipe(gulp.dest(Config.paths.distDocumentation));
});

gulp.task('Documentation-indexPage', function() {
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
        .pipe(handlebars(templateData, hbsoptions))
        .pipe(Plugins.fileinclude({
          prefix: '@@',
          basepath: '@file',
          context: {
            filePath: filePath,
            build: build
          }
        }))
        .pipe(Plugins.rename('index.html'))
        .pipe(gulp.dest(Config.paths.distDocumentation));
});

gulp.task('move-libs', function () {
  return gulp.src(["./src/documentation/libs/**/*.js"])
      .pipe(gulp.dest(Config.paths.distLibPath));
});


//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

var DocumentationTasks = [
    // 'Documentation-build', 
    // 'Documentation-copyAssets',
    // 'ComponentJS',
    'Documentation-pages',
    'Documentation-buildStyles',
    'Documentation-indexPage',
    'move-libs'
    // "Documentation-template",
    // "Documentation-convertMarkdown"
];

//Build Fabric Component Samples
gulp.task('Documentation', DocumentationTasks);
BuildConfig.buildTasks.push('Documentation');
BuildConfig.nukeTasks.push('Documentation-nuke');