var gulp = require('gulp');
var fs = require('fs');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var _ = require('lodash');


var filePath = '';
var build = '';
var jsonData = [];
var templateData,
    hbsoptions = {
      ignorePartials: true,
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
// Build Documentation Styles
// ----------------------------------------------------------------------------
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

//
// Prepare handlebars files
// ----------------------------------------------------------------------------
gulp.task('prepare-handlebars', function(cb) {
  var modelFiles = fs.readdirSync(Config.paths.srcDocumentationModels);
  var jsonFile;
  var jsonFileName;

  // Loop through DocumentationModels and parse JSON data
  for (var i = 0; i < modelFiles.length; i++) {
    jsonFile = fs.readFileSync(Config.paths.srcDocumentationModels + '/' + modelFiles[i], 'utf8');
    jsonFileName = modelFiles[i].replace('.json', '');
    jsonData[jsonFileName] = JSON.parse(jsonFile);
  }

  // Grab Icon data (in separate folder /src/icon/data/) and parse data

  jsonData.icons = JSON.parse(Plugins.fs.readFileSync(Config.paths.iconsData + '/icons.json', "utf8"));;

  templateData = jsonData;
  cb();
});

//
// Build separate pages (Animation, Color, Icons, Localization, Reponsive Grid, Typography)
// ----------------------------------------------------------------------------
gulp.task('Documentation-pages', ['prepare-handlebars'], function () {
  return gulp.src(Config.paths.srcDocsPages + "/**/index.html")
      .pipe(Plugins.plumber(ErrorHandling.oneErrorInPipe))
      .pipe(Plugins.debug({
        title: "Building Documentation Page File to " + Config.paths.distDocumentation
      }))
      .pipe(Plugins.handlebars(templateData, hbsoptions))
      .pipe(Plugins.fileinclude({
        context: {
          filePath: filePath,
          build: build
        }
      }))
      .pipe(gulp.dest(Config.paths.distDocumentation));
});

//
// Build index page
// ----------------------------------------------------------------------------
gulp.task('Documentation-indexPage', function() {
    return gulp.src(Config.paths.srcTemplate + '/documentation-template.html')
        .pipe(Plugins.plumber(ErrorHandling.oneErrorInPipe))
        .pipe(Plugins.debug({
          title: "Building Documentation File to " + Config.paths.distDocumentation
        }))
        .pipe(Plugins.handlebars(templateData, hbsoptions))
        .pipe(Plugins.fileinclude({
          context: {
            filePath: filePath,
            build: build
          }
        }))
        .pipe(Plugins.rename('index.html'))
        .pipe(gulp.dest(Config.paths.distDocumentation));
});


//
// Rolled up Build tasks
// ----------------------------------------------------------------------------
var DocumentationTasks = [
    'Documentation-pages',
    'Documentation-buildStyles',
    'Documentation-indexPage'
];

gulp.task('Documentation', DocumentationTasks);
BuildConfig.buildTasks.push('Documentation');
BuildConfig.nukeTasks.push('Documentation-nuke');