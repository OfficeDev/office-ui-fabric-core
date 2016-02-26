var gulp = require('gulp');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');


//
// Typescript tasks
// ----------------------------------------------------------------------------

gulp.task('ComponentJS-typescript', function() {
    var tscResult = gulp.src(Config.paths.componentsPath + '/**/*.ts')
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.tslint())
        .pipe(Plugins.tslint.report("verbose"))
        .pipe(Plugins.tsc(Config.typescriptProject));

    return Plugins.mergeStream( [
      tscResult.dts.pipe(gulp.dest(Config.paths.distSamples + '/Components'))
                   .pipe(gulp.dest(Config.paths.distComponents)),
      tscResult.js.pipe(gulp.dest(Config.paths.distSamples + '/Components'))
                  .pipe(gulp.dest(Config.paths.distComponents))

                  // concat and minify
                  .pipe(Plugins.concat('fabric.js'))
                  .pipe(Plugins.header(Banners.getJSCopyRight()))
                  .pipe(Plugins.changed(Config.paths.distJS))
                  .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                        title: "Concat Fabric Component JS built from TS"
                  })))
                  .pipe(gulp.dest(Config.paths.distJS))
                  .pipe(Plugins.rename('fabric.min.js'))
                  .pipe(Plugins.uglify())
                  .pipe(gulp.dest(Config.paths.distJS))
    ]);
});


//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

var ComponentJSTasks = [
    'ComponentJS-typescript',
];

//Build Fabric Component Samples
gulp.task('ComponentJS', ComponentJSTasks);
