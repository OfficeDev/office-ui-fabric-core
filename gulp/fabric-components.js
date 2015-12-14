var gulp = require('gulp');

var storedFiles = {};

var utilities = require('./modules/Utilities');
var banners = require('./modules/Banners');
var fabricServer = require('./modules/Server');
var config = require('./modules/Config');
var messaging = require('./modules/Messaging');
var errorHandling = require('./modules/ErrorHandling');
var plugins = require('./modules/Plugins');


var buildEachComponentCss = function (destination) {
    return componentsFolders.map(function(folder) {

        var manifest = utilities.parseManifest(folder);
        var deps = manifest.dependencies || [];

        return gulp.src(config.paths.templatePath + '/'+ 'component-manifest-template.less')
            .pipe(plugins.data(function () {
                return { "componentName": folder, "dependencies": deps };
            }))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.template())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.less())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(plugins.rename(folder + '.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssbeautify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.csscomb())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getCSSCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destination + folder))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename(folder + '.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getCSSCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destination + folder))
                .on('error', errorHandling.onErrorInPipe);
    });
}

// Component parts
var componentsFolders = utilities.getFolders(config.paths.componentsPath);
var catalogContents = "";
var componentLinks = [];
var samplesLinks = "";
var samplesFolders = utilities.getFolders(config.paths.srcSamples);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('clean-fabric-components', function () {
    return plugins.del.sync([config.paths.distComponents, config.paths.distJS]);
});


//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('copy-fabric-components', ['clean-fabric-components'], function () {
    // Copy all Components files.
    return gulp.src('src/components/**')
        .pipe(gulp.dest(config.paths.distComponents));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build Components LESS files
gulp.task('fabric-components-less', ['clean-fabric-components'], function () {

    var _componentsBase = function() {
        return gulp.src('src/less/fabric.components.less')
            .pipe(plugins.less())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .on('error', errorHandling.onErrorInPipe);
    }
    // Build components CSS.
    var components = _componentsBase()
        .pipe(plugins.rename('fabric.components.css'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.cssbeautify())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.csscomb())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distPath + '/css/'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.rename('fabric.components.min.css'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.cssMinify())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distPath + '/css/'))
            .on('error', errorHandling.onErrorInPipe);

    // Build Fabric Components RTL CSS.
    var componentsRtl = _componentsBase()
            .pipe(plugins.flipper())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssbeautify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.csscomb())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.components.rtl.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distPath + '/css/'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename('fabric.components.rtl.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(config.paths.distPath + '/css/'))
                .on('error', errorHandling.onErrorInPipe);

    var componentsCSS = buildEachComponentCss(config.paths.distComponents + '/');
    return plugins.mergeStream(components, componentsRtl, componentsCSS);
});

//
// JS Only tasks
// ----------------------------------------------------------------------------

gulp.task('fabric-components-js', ['clean-fabric-components'], function() {

    return gulp.src(config.paths.componentsPath + '/**/*.js')
        .pipe(plugins.concat('jquery.fabric.js'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distJS))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.rename('jquery.fabric.min.js'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.uglify())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.header(banners.getJSCopyRight()))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distJS));
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

// Build for Fabric component demos
gulp.task('build-fabric-components', ['clean-fabric-components', 'copy-fabric-components', 'fabric-components-less', 'fabric-components-js']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('fabric-components-finished', ['build-fabric-components'], function () {
    console.log(messaging.generateSuccess(' Components build was successful! Yay!', true));
});

gulp.task('fabric-components-updated', ['build-fabric-components'], function () {
    console.log(messaging.generateSuccess(' Components updated successfully! Yay!'));
});


//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components and builds fabric.components.
gulp.task('watch:fabric-components', ['build-fabric-components', 'fabric-components-finished'], function () {
    return gulp.watch(config.paths.componentsPath + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('build-fabric-components', 'fabric-components-updated', done);
    }));
});
