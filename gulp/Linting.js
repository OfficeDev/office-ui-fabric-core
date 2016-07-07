var gulp = require('gulp');
var Config = require('./modules/Config');
var Plugins = require('./modules/Plugins');
var BuildConfig = require('./modules/BuildConfig');
var ErrorHandling = require('./modules/ErrorHandling');

gulp.task('Linting-spacesTabs', function (cb) {
    return gulp.src([
            Config.paths.src + '/**/*.ts', 
            Config.paths.componentsPath + '/**/*.scss',
            Config.paths.componentsPath + '/**/*.html'
        ])
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.lintspaces({
          trailingspaces: true,
          indentation: 'spaces',
	        spaces: 2,
          ignores: [
            'js-comments',
            "\/\/\/[\w\s\']*"
          ]
        }))
        .pipe(ErrorHandling.TabLintingErrors());
});

gulp.task('Linting-typescript', function (cb) {
    return gulp.src(Config.paths.src + '/**/*.ts')
        .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
        .pipe(Plugins.tslint())
        .pipe(ErrorHandling.TypescriptLinting());
});

gulp.task('Linting-componentStyles',  function(cb) {
   gulp.src(Config.paths.componentsPath + '/**/*.scss')
      .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
      .pipe(Plugins.gulpif(Config.debugMode, Plugins.debug({
          title: "Checking SASS Compile errors and linting"
      })))
     .pipe(Plugins.sasslint())
     .pipe(ErrorHandling.SASSlintErrors());
   cb();
 });

var tasks = [
    'Linting-typescript',
    'Linting-componentStyles',
    'Linting-spacesTabs'
];

//Build Fabric Component Samples
gulp.task('Linting', tasks);
BuildConfig.buildTasks.push('Linting');