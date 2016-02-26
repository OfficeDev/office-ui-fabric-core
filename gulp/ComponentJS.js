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

      // place output in both the Samples folder and the Components folder
      tscResult.dts.pipe(gulp.dest(Config.paths.distSamples + '/Components'))
                   .pipe(gulp.dest(Config.paths.distComponents)),

      // place output in both the Samples folder and the Components folder
      tscResult.js.pipe(gulp.dest(Config.paths.distSamples + '/Components'))
                  .pipe(gulp.dest(Config.paths.distComponents))
                  .pipe(Plugins.debug({
                        title: "Output Fabric Component JS built from TS"
                  }))

                  // concat the output files into a single fabric.js file
                  .pipe(Plugins.concat('fabric.js'))
                  .pipe(Plugins.header(Banners.getJSCopyRight()))
                  // .pipe(Plugins.changed(Config.paths.distJS)) // doing this prevents the file from getting updated if it already exists
                  .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                        title: "Concat Fabric Component JS built from TS"
                  })))
                  .pipe(gulp.dest(Config.paths.distJS))

                  // minify the concat file
                  .pipe(Plugins.rename('fabric.min.js'))
                  .pipe(Plugins.uglify())
                  .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
                        title: "Minify Fabric Component JS built from TS"
                  })))
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
