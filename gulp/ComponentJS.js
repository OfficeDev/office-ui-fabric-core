var gulp = require('gulp');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentJS-nuke', function () {
    return Plugins.del.sync([Config.paths.distJS, Config.paths.distLibPath]);
});


//
// Library tasks
// ----------------------------------------------------------------------------
gulp.task('ComponentJS-copyLib', function() {
    return gulp.src(Config.paths.srcLibPath + '/**/*')
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.changed(Config.paths.distLibPath))
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
              title: "Copying /lib folder to dist folder"
        })))
        .pipe(gulp.dest(Config.paths.distLibPath));
});

//
// Typescript tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentJS-lint', function (cb) {
    return gulp.src(Config.paths.srcPath + '/**/*.ts')
        
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))

        // tslint options set by tslint.json
        .pipe(Plugins.tslint())
        .pipe(Plugins.tslint.report("verbose"));
});

gulp.task('ComponentJS-typescript', function() {
    var tscResult = gulp.src(Config.paths.srcPath + '/**/*.ts')
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
            title: "Typescriptingz the file"
        })))
        // only process TS files that have changed since last compiled to /dist/Components
        .pipe(Plugins.changed(Config.paths.distComponents, {extension: '.js'}))
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))

        // Typescript project is set to give us both definitions and javascript
        .pipe(Plugins.tsc(Config.typescriptProject));

    return Plugins.mergeStream( [

      // place .d.ts outqput in both the Samples folder and the Components folder
      tscResult.dts.pipe(gulp.dest(Config.paths.distSamples + '/Components'))
                   .pipe(gulp.dest(Config.paths.distComponents))
                   .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                     title: "Output Fabric Component .d.ts built from TypeScript"
                   }))),

      // place .js output in both the Samples folder and the Components folder
      tscResult.js.pipe(gulp.dest(Config.paths.distSamples + '/Components'))
                  .pipe(gulp.dest(Config.paths.distComponents))
                  .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                    title: "Output Fabric Component .js built from TypeScript"
                  })))
    ]);
});

//
// Concat and minify the output files into a single fabric.js file
gulp.task('ComponentJS-concatJS', ['ComponentJS-typescript'], function() {

    return gulp.src(Config.paths.distComponents + '/**/*.js')
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.concat('fabric.js'))
        .pipe(Plugins.header(Banners.getJSCopyRight()))
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Concat Fabric Component JS"
        })))
        .pipe(gulp.dest(Config.paths.distJS))
        .pipe(Plugins.rename('fabric.min.js'))
        .pipe(Plugins.uglify())
        .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                title: "Minify Fabric Component JS"
        })))
        .pipe(gulp.dest(Config.paths.distJS));
});


//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

var ComponentJSTasks = [
    'ComponentJS-copyLib',
    'ComponentJS-typescript',
    'ComponentJS-concatJS',
    'ComponentJS-lint'
];

//Build Fabric Component Samples
gulp.task('ComponentJS', ComponentJSTasks);
