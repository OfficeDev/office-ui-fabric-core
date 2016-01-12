var gulp = require('gulp');

// Fabric Helper Modules
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var Utilities = require('./modules/Utilities');
var ComponentHelper = require('./modules/ComponentHelper');

var folderList = Utilities.getFolders(Config.paths.componentsPath);

gulp.task('SassConversion', function () {
   return folderList.map(function(componentName) {
        return gulp.src(Config.paths.componentsPath + '/' + componentName + '/*.less')
            .pipe(Plugins.debug({
                title: "Building Sample Component " + componentName
            }))
            .pipe(Plugins.lessToScss())
            .pipe(gulp.dest(Config.paths.distComponents + '/' + componentName));
   });
});
gulp.task('SassConversion-template', function () {
        return gulp.src(Config.paths.templatePath + '/*.less')
            .pipe(Plugins.debug({
                title: "Building Sample Component "
            }))
            .pipe(Plugins.lessToScss())
            .pipe(gulp.dest(Config.paths.templatePath + '/'));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentSamples-less',  function() {
   return folderList.map(function(componentName) {

        var srcTemplate = Config.paths.templatePath + '/'+ 'component-manifest-template.less';
        var destFolder = Config.paths.distSampleComponents + '/' + componentName;
        var srcFolderName = Config.paths.componentsPath + '/' + componentName;
        var manifest = Utilities.parseManifest(srcFolderName + '/' + componentName + '.json');
        var deps = manifest.dependencies || [];
        var distFolderName = Config.paths.distSampleComponents + '/' + componentName;
        var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.less', '.css');
        
        if(hasFileChanged) {
            return ComponentHelper.buildComponentStyles(destFolder, srcTemplate, componentName, deps);
        } else {
            return;
        }

   });
});

