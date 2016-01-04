var gulp = require('gulp');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
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
gulp.task('FabricComponents-compiledLess', function () {

    return gulp.src(Config.paths.srcLess + '/fabric.components.less')
        .pipe(Plugins.less())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Building Fabric Components Less into One Files"
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

gulp.task('FabricComponents-less', function () {
    return folderList.map(function(componentName) {
       
        var srcTemplate = Config.paths.templatePath + '/'+ 'component-manifest-template.less';
        var destFolder = Config.paths.distComponents + '/' + componentName;
        var srcFolderName = Config.paths.componentsPath + '/' + componentName;
        var manifest = Utilities.parseManifest(srcFolderName + '/' + componentName + '.json');
        var deps = manifest.dependencies || [];
        var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, destFolder, '.less', '.css');
        
        if(hasFileChanged) {
            return ComponentHelper.buildComponentStyles(destFolder, srcTemplate, componentName, deps);
        } else {
            return;
        }
    });
});

//
// JS Only tasks
// ----------------------------------------------------------------------------

gulp.task('FabricComponents-Movejs', function() {
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
gulp.task('FabricComponents', ['FabricComponents-compiledLess', 'FabricComponents-less', 'FabricComponents-copyAssets', 'FabricComponents-Movejs']);

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
