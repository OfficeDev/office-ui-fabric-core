var gulp = require('gulp');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var ComponentHelper = require('./modules/ComponentHelper');
var folderList = Utilities.getFolders(Config.paths.componentsPath);


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
    return gulp.src([Config.paths.componentsPath + '/**', '!' + Config.paths.componentsPath + '/**/*.js'])
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.changed(Config.paths.distComponents))
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Moving Fabric Component Assets to Dist"
        })))
        .pipe(gulp.dest(Config.paths.distComponents));
});

gulp.task('FabricComponents-moveJs', function () {
    // Copy all Components files.
    return gulp.src([Config.paths.componentsPath + '/**/*.js'])
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.changed(Config.paths.distComponents))
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Moving Fabric Component Assets to Dist"
        })))
        .pipe(Plugins.fileinclude())
        .pipe(gulp.dest(Config.paths.distComponents));
});

//
// Sass tasks
// ----------------------------------------------------------------------------

// Build Components Sass files
gulp.task('FabricComponents-buildAndCombineStyles', function () {
    var stream = gulp.src(BuildConfig.srcPath + '/Fabric.Components.' + BuildConfig.fileExtension)
        .pipe(Plugins.plumber())
        .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
        .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
        .pipe(BuildConfig.processorPlugin().on('error', BuildConfig.compileErrorHandler))
        .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Building Fabric Components " + BuildConfig.processorName + " into One Files"
        })))
        .pipe(Plugins.autoprefixer(
            {
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }
        ))
        .pipe(Plugins.rename('fabric.components.css'))
        .pipe(Plugins.cssbeautify())
        .pipe(Plugins.csscomb())
        .pipe(gulp.dest(Config.paths.distCSS))
        .pipe(Plugins.rename('fabric.components.min.css'))
        .pipe(Plugins.cssMinify())
        .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
        .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
        .pipe(gulp.dest(Config.paths.distCSS))
        .pipe(Plugins.flipper())
        .pipe(Plugins.cssbeautify())
        .pipe(Plugins.csscomb())
        .pipe(Plugins.rename('fabric.components.rtl.css'))
        .pipe(gulp.dest(Config.paths.distCSS))
        .pipe(Plugins.cssMinify())
        .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
        .pipe(Plugins.header(Banners.getCSSCopyRight(), Banners.getBannerData()))
        .pipe(Plugins.rename('fabric.components.rtl.min.css'))
        .pipe(gulp.dest(Config.paths.distCSS));
     return stream;
     
});

gulp.task('FabricComponents-buildStyles', function () {
    return folderList.map(function(componentName) {
       
        var srcTemplate = Config.paths.templatePath + '/'+ BuildConfig.template;
        var destFolder = Config.paths.distComponents + '/' + componentName;
        var srcFolderName = Config.paths.componentsPath + '/' + componentName;
        var manifest = Utilities.parseManifest(srcFolderName + '/' + componentName + '.json');
        var deps = manifest.dependencies || [];
        var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, destFolder, '.' + BuildConfig.fileExtension, '.css');
        
        if(hasFileChanged) {
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

//
// JS Only tasks
// ----------------------------------------------------------------------------


gulp.task('FabricComponents-moveJs', function() {
    return gulp.src(Config.paths.componentsPath + '/**/*.js')
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.concat('jquery.fabric.js'))
        .pipe(Plugins.header(Banners.getJSCopyRight()))
        .pipe(Plugins.changed(Config.paths.distJS))
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Moving Fabric Component JS"
        })))
        .pipe(gulp.dest(Config.paths.distJS))
        .pipe(Plugins.rename('jquery.fabric.min.js'))
        .pipe(Plugins.uglify())
        .pipe(gulp.dest(Config.paths.distJS));
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

// Build for Fabric component demos
gulp.task('FabricComponents', [
    'FabricComponents-buildAndCombineStyles', 
    'FabricComponents-buildStyles', 
    'FabricComponents-copyAssets', 
    'FabricComponents-moveJs'
    ]
);

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
