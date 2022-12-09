var gulp = require('gulp');
var fs = require('fs');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');

var filePath = '';
var build = '';
var jsonData = [];
var templateData,
  hbsoptions = {
    ignorePartials: true,
    partials: {},
    batch: [Config.paths.srcDocTemplateModulesComponents],
    helpers: {}
  }

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------
function documentationNuke(done) {
  Plugins.del.sync([Config.paths.distDocumentation]);
  done();
};

//
// Build Documentation Styles
// ----------------------------------------------------------------------------
function documentationBuildStyles() {
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
};

//
// Prepare handlebars files
// ----------------------------------------------------------------------------
function prepareHandlebars(cb) {
  var modelFiles = fs.readdirSync(Config.paths.srcDocumentationModels);


  // Loop through DocumentationModels and parse JSON data
  for (var i = 0; i < modelFiles.length; i++) {
    const jsonFile = fs.readFileSync(Config.paths.srcDocumentationModels + '/' + modelFiles[i], 'utf8');
    const jsonFileName = modelFiles[i].replace('.json', '');
    jsonData[jsonFileName] = JSON.parse(jsonFile);
  }
  // Grab Icon data (in separate folder /src/data/) and parse data
  const iconData = fs.readFileSync(Config.paths.srcData + '/' + 'icons.json', 'utf8');
  jsonData['icons'] = JSON.parse(iconData);

  const brandIcons = fs.readFileSync(Config.paths.srcData + '/' + 'brand-icons.json', 'utf8');
  jsonData['brandIcons'] = JSON.parse(brandIcons);

  const fileTypeIcons = fs.readFileSync(Config.paths.srcData + '/' + 'file-type-icons.json', 'utf8');
  jsonData['fileTypeIcons'] = JSON.parse(fileTypeIcons);

  templateData = jsonData;
  cb();
};

//
// Build separate pages (Animation, Color, Icons, Localization, Reponsive Grid, Typography)
// ----------------------------------------------------------------------------
function documentationPages() {
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
};

//
// Build index page
// ----------------------------------------------------------------------------
function documentationIndexPage() {
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
};

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

exports.documentationNuke = documentationNuke;
exports.documentationBuild = gulp.series(prepareHandlebars, gulp.parallel(documentationPages, documentationBuildStyles, documentationIndexPage));
