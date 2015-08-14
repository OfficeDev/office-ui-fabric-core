var gulp = require('gulp');
var del = require('del');
var fs = require('fs');
var less = require('gulp-less');
var batch = require('gulp-batch');
var cssMinify = require('gulp-minify-css');
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var file = require('gulp-file');
var flipper = require('gulp-css-flipper');
var autoprefixer = require('gulp-autoprefixer');
var mergeStream = require('merge-stream');
var rename = require('gulp-rename');
var es = require('event-stream');
var _ = require('lodash');
var pkg = require('../package.json');
var header = require('gulp-header');
var zip = require('gulp-zip');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var data = require('gulp-data');
var folders = require('gulp-folders');
var browserSync = require('browser-sync').create();
var colors = require('colors/safe');
var path = require('path');

// Define paths.
var paths = {
    distPath: 'dist',
    componentsPath : 'src/components',
    distCompsPath : 'dist/components',
    templatePath : 'src/templates'
};

var storedFiles = {};

var spacing = "\r\n";
var spaceDashes = colors.rainbow("---------------------------------------------------");
var linkTitle = colors.green("Fabric") + colors.cyan(' Distrobution complete') + colors.green('');
// var completURL = spaceDashes + spacing + spacing + linkTitle + spacing +  colors.magenta(url +':' + portNum) + spacing + spacing + spaceDashes;

//
// Build fabric banner
// ----------------------------------------------------------------------------

var date = new Date();
var monthNames = ["January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"];
var bannerTemplate = ['/**',
      ' * <%= pkg.name %> <%= pkg.version %>',
      ' * <%= pkg.description %>',
      ' **/',
      ''].join('\n');

// Emit the end of the event so further pipes don't continue working
// on pipes that have bad data/files in it. Essentially, errors shouldn't cause
// tasks to exit now.
var onGulpError = function (error) {
    console.log(error);
    this.emit('end');
};

// Helper for retrieving folders
var getFolders = function(dir) {
    return fs.readdirSync(dir)
    .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

var componentsFolders = getFolders(paths.componentsPath);
var catalogContents = ""; // Starts off the file contents building
var catalogFile = "";

// Fabric Build Tools

// Clean out the distribution folder.
gulp.task('clean:fabric', function() {
    return del.sync([paths.distPath]);
});

//
// Tasks for building Fabric for distribution.
// ----------------------------------------------------------------------------

// Copy all uncompiled LESS files to distribution folder.
gulp.task('copy', ['clean:fabric'], function () {
    // Copy LESS files.
    var less = gulp.src('src/less/*')
        .pipe(gulp.dest(paths.distPath + '/less'));

    // Copy all Components files.
    var components = gulp.src('src/components/**')
        .pipe(gulp.dest(paths.distPath + '/components'));

    return mergeStream(less, components);
});

// Build LESS files for core Fabric and Components into LTR and RTL CSS files.
gulp.task('build-less', ['clean:fabric'], function() {

    // Confgure data objects to pass into banner plugin.
    var bannerData = {
        pkg : pkg,
        date: date,
        monthNames: monthNames
    }

    // Baseline set of tasks for building Fabric CSS.
    var _fabricBase = function() {
        return gulp.src(['src/less/fabric.less'])
            .pipe(less())
                .on('error', onGulpError)
            .pipe(rename('fabric.css'))
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
                .on('error', onGulpError);
    }

    // Build full and minified Fabric CSS.
    var fabric = _fabricBase()
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError)
            .pipe(rename('fabric.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError);

    // Build full and minified Fabric RTL CSS.
    var fabricRtl = gulp.src('src/less/fabric.rtl.less')
            .pipe(less())
                .on('error', onGulpError)
            .pipe(flipper())
                .on('error', onGulpError)
            .pipe(rename('fabric.rtl.css'))
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
                .on('error', onGulpError)
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError)
            .pipe(rename('fabric.rtl.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError);

    var _componentsBase = function() {
        return gulp.src('src/less/fabric.components.less')
            .pipe(less())
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .on('error', onGulpError);
    }

    // Build full and minified Fabric Components CSS.
    var components = _componentsBase()
            .pipe(rename('fabric.components.css'))
                .on('error', onGulpError)
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError)
            .pipe(rename('fabric.components.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError);

    // Build full and minified Fabric Components RTL CSS.
    var componentsRtl = _componentsBase()
            .pipe(flipper())
                .on('error', onGulpError)
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(rename('fabric.components.rtl.css'))
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(rename('fabric.components.rtl.min.css'))
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError);
 
    // Build full and minified Fabric Components CSS for each Component.
    var indComponents = componentsFolders.map(function(folder) {
        var manifest = JSON.parse(fs.readFileSync(paths.componentsPath + '/' +  folder + '/' +  folder + '.json'));
        var deps = manifest.dependencies || [];

        return gulp.src(paths.templatePath + '/'+ 'component-manifest-template.less')
            .pipe(data(function () {
                return { "componentName": folder, "dependencies": deps };
            }))
                .on('error', onGulpError)
            .pipe(template())
                .on('error', onGulpError)
            .pipe(less())
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(rename(folder + '.css'))
                .on('error', onGulpError)
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distCompsPath + '/' + folder))
                .on('error', onGulpError)
            .pipe(rename(folder + '.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distCompsPath  + '/' + folder))
                .on('error', onGulpError);
    });

    // Merge all current streams into one.
    return mergeStream(fabric, fabricRtl, components, componentsRtl, indComponents);
});

gulp.task('copy-components-html', folders(paths.componentsPath, function(folder) {
        return gulp.src(paths.componentsPath + '/' +  folder + '/*.html')
                .on('error', onGulpError)
            .pipe(concat(folder + '.html'))
                .on('error', onGulpError)
            .pipe(tap(function(file) {
                storedFiles[folder] = file.contents.toString();
                var curString = storedFiles[folder];
                curString = JSON.stringify(curString);
                //Check if module was already included in string
                if(catalogContents.indexOf(folder + ':') < 0) {
                    catalogContents += ', "' + folder + '" : ' + curString + ' ';
                }
            }))
                .on('error', onGulpError);
}));

gulp.task('build-component-examples', ['copy-components-html'], folders(paths.componentsPath, function(folder){
        return gulp.src(paths.templatePath + '/'+ 'individual-component-example.html')
            .on('error', onGulpError)
        .pipe(data(function () {
            return { "componentName": folder, "stored": storedFiles[folder] };
        }))
            .on('error', onGulpError)
        .pipe(template())
            .on('error', onGulpError)
        .pipe(rename(folder + '-demos.html'))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distCompsPath + '/' +  folder))
            .on('error', onGulpError);
}));

// // Build up catalog to be used  
// gulp.task('create-catalog-string', ['copy-components-html'], function() {
//     return catalogFile =  '{ "catalog" : [' + '{ "start" : ""' + catalogContents + '}] }';
// });

// gulp.task('create-component-catalog', ['create-catalog-string'], folders(paths.componentsPath, function(folder) {
//     return file('htmlcatalog.json', catalogFile, { src: true })
//             .on('error', onGulpError)
//         .pipe(gulp.dest(paths.dataPath));
// }));

// Roll up static resource building
gulp.task('build-resources', ['clean:fabric', 'copy', 'build-less', 'copy-components-html', 'build-component-examples']);

// Archive the entire distribution folder for easy distribution
gulp.task('build-fabric', ['build-resources'], function() {
    return gulp.src(paths.distPath + '/**/*')
        .pipe(zip('fabric-' + pkg.version + '.zip'))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distPath))
            .on('error', onGulpError);
});

// Watch and build Fabric when sources change.
gulp.task('watch:fabric', ['build-fabric'], function() {
    gulp.watch('src/**/*', batch(function(events, done) {
        runSequence('build-fabric', done);
    }));
});

