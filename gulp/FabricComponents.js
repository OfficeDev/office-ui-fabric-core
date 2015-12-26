var gulp = require('gulp');
var gulputil = require('gulp-util');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var ComponentHelper = require('./modules/ComponentHelper');
var folderList = Utilities.getFolders(Config.paths.componentsPath);
var tidy = require("tidy-html5").tidy_html5;

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
    return gulp.src([Config.paths.componentsPath + '/**', '!' + Config.paths.componentsPath + '/**/*.html'])
        .pipe(Plugins.changed(Config.paths.distComponents))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Moving Fabric Component Assets to Dist"
        })))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distComponents));
});

gulp.task('FabricComponents-copyAndParseHTML', function () {

    // Copy all Components files.
    return gulp.src(Config.paths.componentsPath + '/**/*.html')
        // Run HTML Tidy
      	// .pipe(Plugins.htmllint({config: Config.htmlLintPath}, ErrorHandling.handlHTMLLintError))
        .pipe(Plugins.verifyHTML({
            showErrors: true,
            showWarnings: true,
            "doctype": "omit",
            "drop-empty-elements": false,
            "drop-empty-paras": false,
        }, function(err, html) {
            var newError = '';
            // console.log(err);
                  
            newError = err.replace('About this fork of Tidy: http://w3c.github.com/tidy-html5/', '');
            newError = newError.replace('Bug reports and comments: https://github.com/w3c/tidy-html5/issues/', '');
            newError = newError.replace('Or send questions and comments to html-tidy@w3.org', '');
            newError = newError.replace('Latest HTML specification: http://dev.w3.org/html5/spec-author-view/', '');
            newError = newError.replace('HTML language reference: http://dev.w3.org/html5/markup/', '');
            newError = newError.replace('Validate your HTML5 documents: http://validator.w3.org/nu/', '');
            newError = newError.replace('Lobby your company to join the W3C: http://www.w3.org/Consortium', '');
            
            if(newError.indexOf("\n") > -1) {
                console.log("Found error"); 
            }
            
            console.log(newError);
            
        }))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.changed(Config.paths.distComponents))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Copy Fabric Component HTML files"
        })))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(gulp.dest(Config.paths.distComponents));
});


//
// LESS tasks
// ----------------------------------------------------------------------------

// Build Components LESS files
gulp.task('FabricComponents-less', function () {

    return gulp.src(Config.paths.srcLess + '/fabric.components.less')
        .pipe(Plugins.changed(Config.paths.distCSS, {extension: '.css'}))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Building Fabric Components Less into One Files"
        })))
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.less())
            .on('error', ErrorHandling.onErrorInPipe)
        .pipe(Plugins.header(Banners.getBannerTemplate(), Banners.getBannerData()))
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
        var manifest = Utilities.parseManifest(componentName);
        var deps = manifest.dependencies || [];
        var srcTemplate = Config.paths.templatePath + '/'+ 'component-manifest-template.less';
        var destFolder = Config.paths.distComponents + '/' + componentName;
        var srcFolderName = Config.paths.componentsPath + '/' + componentName;
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
gulp.task('FabricComponents', ['FabricComponents-less', 'FabricComponents-copyAssets', 'FabricComponents-copyAndParseHTML', 'FabricComponents-Movejs']);

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
