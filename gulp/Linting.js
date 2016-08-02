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

var tasks = [
    'Linting-spacesTabs'
];

//Build Fabric Component Samples
gulp.task('Linting', tasks);
BuildConfig.buildTasks.push('Linting');