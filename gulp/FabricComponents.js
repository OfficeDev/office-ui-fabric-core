var gulp = require('gulp');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');
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
var name;

// Check if building SASS
if(Config.buildSass) {
    srcPath = Config.paths.srcSass;
    cssPlugin = Plugins.sass;
    fileExtension = '.' + Config.sassExtension;
    template = 'component-manifest-template' + fileExtension
    name = "SASS";
} else {
    srcPath = Config.paths.srcLess;
    cssPlugin = Plugins.less;
    fileExtension = '.' + Config.lessExtension;
    template = 'component-manifest-template' + fileExtension
    name = "LESS";
}


//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('FabricComponents-nuke', function () {
    return Plugins.del.sync([Config.paths.distComponents, Config.paths.distJS]);
});


//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('FabricComponents-copyAssets', function () {
    // Copy all Components files.
    return gulp.src([Config.paths.componentsPath + '/**'])
        .pipe(Plugins.changed(Config.paths.distComponents))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Moving Fabric Component Assets to Dist"
        })))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distComponents));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build Components LESS files
gulp.task('FabricComponents-buildAndCombineStyles', function () {

    return gulp.src(Config.paths.srcLess + '/fabric.components.less')
        .pipe(cssPlugin())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Building Fabric Components " + name + " into One Files"
        })))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.autoprefixer(
            {
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }
        ))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.rename('fabric.components.css'))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.cssbeautify())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.csscomb())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distCSS))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.rename('fabric.components.min.css'))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.cssMinify())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distCSS))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.flipper())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.cssbeautify())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.csscomb())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.rename('fabric.components.rtl.css'))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distCSS))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.cssMinify())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.rename('fabric.components.rtl.min.css'))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distCSS))
            .on('error', ErrorHandling.onErrorInPipe);
});

gulp.task('FabricComponents-buildStyles', function () {
    return folderList.map(function(componentName) {
       
        var srcTemplate = Config.paths.templatePath + '/'+ template;
        var destFolder = Config.paths.distComponents + '/' + componentName;
        var srcFolderName = Config.paths.componentsPath + '/' + componentName;
        var manifest = Utilities.parseManifest(srcFolderName + '/' + componentName + '.json');
        var deps = manifest.dependencies || [];
        var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, destFolder, fileExtension, '.css');
        
        if(hasFileChanged) {
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
// JS Only tasks
// ----------------------------------------------------------------------------

gulp.task('FabricComponents-moveJs', function() {
    return gulp.src(Config.paths.componentsPath + '/**/*.js')
        .pipe(Plugins.concat('jquery.fabric.js'))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.header(Banners.getJSCopyRight()))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.changed(Config.paths.distJS))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Moving Fabric Component JS"
        })))
        .pipe(gulp.dest(Config.paths.distJS))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.rename('jquery.fabric.min.js'))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.uglify())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distJS));
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

// Build for Fabric component demos
gulp.task('FabricComponents', ['FabricComponents-buildAndCombineStyles', 'FabricComponents-buildStyles', 'FabricComponents-copyAssets', 'FabricComponents-moveJs']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('FabricComponents-finished', ['FabricComponents'], function () {
    console.log(ConsoleHelper.generateSuccess(' Components build was successful! Yay!', true));
});

gulp.task('FabricComponents-updated', ['FabricComponents'], function () {
    console.log(ConsoleHelper.generateSuccess(' Components updated successfully! Yay!'));
});


//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components and builds fabric.components.
gulp.task('FabricComponents-watch', ['FabricComponents', 'FabricComponents-finished'], function () {
    return gulp.watch(Config.paths.componentsPath + '/**/*', Plugins.batch(function (events, done) {
        Plugins.runSequence('FabricComponents', 'FabricComponents-updated', done);
    }));
});
