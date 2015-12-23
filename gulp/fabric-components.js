var gulp = require('gulp');

var storedFiles = {};

var utilities = require('./modules/Utilities');
var banners = require('./modules/Banners');
var fabricServer = require('./modules/Server');
var config = require('./modules/Config');
var messaging = require('./modules/Messaging');
var errorHandling = require('./modules/ErrorHandling');
var plugins = require('./modules/Plugins');
var ComponentHelper = require('./modules/ComponentHelper');
var folderList = utilities.getFolders(config.paths.componentsPath);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('FabricComponents-nuke', function () {
    return plugins.del.sync([config.paths.distComponents, config.paths.distJS]);
});


//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('FabricComponents-copyAssets', function () {
    // Copy all Components files.
    return gulp.src(config.paths.componentsPath + '/**')
        .pipe(plugins.changed(config.paths.distComponents))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                title: "Moving Fabric Component Assets to Dist"
        })))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distComponents));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build Components LESS files
gulp.task('FabricComponents-less', function () {

    return gulp.src(config.paths.srcLess + '/fabric.components.less')
        .pipe(plugins.changed(config.paths.distCSS, {extension: '.css'}))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                title: "Building Fabric Components Less into One Files"
        })))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.less())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            cascade: false
        }))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.rename('fabric.components.css'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.cssbeautify())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.csscomb())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distCSS))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.rename('fabric.components.min.css'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.cssMinify())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distCSS))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.flipper())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.cssbeautify())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.csscomb())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.rename('fabric.components.rtl.css'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distCSS))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.cssMinify())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.rename('fabric.components.rtl.min.css'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distCSS))
            .on('error', errorHandling.onErrorInPipe);
});

gulp.task('FabricComponents-less', function () {
    return folderList.map(function(componentName) {
        var manifest = utilities.parseManifest(componentName);
        var deps = manifest.dependencies || [];
        var srcTemplate = config.paths.templatePath + '/'+ 'component-manifest-template.less';
        var destFolder = config.paths.distComponents + '/' + componentName;
        var srcFolderName = config.paths.componentsPath + '/' + componentName;
        var hasFileChanged = utilities.hasFileChangedInFolder(srcFolderName, destFolder, '.less', '.css');
        
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
    return gulp.src(config.paths.componentsPath + '/**/*.js')
        .pipe(plugins.concat('jquery.fabric.js'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.header(banners.getJSCopyRight()))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.changed(config.paths.distJS))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.gulpif(config.debugMode, plugins.debug({
                title: "Moving Fabric Component JS"
        })))
        .pipe(gulp.dest(config.paths.distJS))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.rename('jquery.fabric.min.js'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.uglify())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distJS));
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

// Build for Fabric component demos
gulp.task('FabricComponents', ['FabricComponents-less', 'FabricComponents-copyAssets', 'FabricComponents-Movejs']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('FabricComponents-finished', ['FabricComponents'], function () {
    console.log(messaging.generateSuccess(' Components build was successful! Yay!', true));
});

gulp.task('FabricComponents-updated', ['FabricComponents'], function () {
    console.log(messaging.generateSuccess(' Components updated successfully! Yay!'));
});


//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components and builds fabric.components.
gulp.task('FabricComponents-watch', ['FabricComponents', 'FabricComponents-finished'], function () {
    return gulp.watch(config.paths.componentsPath + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('FabricComponents', 'FabricComponents-updated', done);
    }));
});
