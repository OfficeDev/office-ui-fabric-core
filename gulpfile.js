var gulp = require('gulp');
var tsc = require('gulp-typescript');
var del = require('del');
var fs = require('fs');
var flatten = require('gulp-flatten');
var uglify = require('gulp-uglifyjs');
var less = require('gulp-less');
var batch = require('gulp-batch');
var cssMinify = require('gulp-minify-css');
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var file = require('gulp-file');
var flipper = require('gulp-css-flipper');
var autoprefixer = require('gulp-autoprefixer');
var texttojs = require('gulp-texttojs');
var htmlMinify = require('gulp-minify-html');
var size = require('gulp-size');
var mergeStream = require('merge-stream');
var chmod = require('gulp-chmod');
var jeditor = require('gulp-json-editor');
var rename = require('gulp-rename');
var es = require('event-stream');
var path = require('path');
var _ = require('lodash');
var express = require('express');
var pkg = require('./package.json');
var log = require('./docs/build/log.js');
var header = require('gulp-header');
var zip = require('gulp-zip');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var concat = require('gulp-concat');
var app = express();
var wait = require('gulp-wait');
var fs = require('fs');
var tap = require('gulp-tap');
var data = require('gulp-data');
var folders = require('gulp-folders');
var browserSync = require('browser-sync').create();
var argv = require('yargs').argv;
var colors = require('colors/safe');


// Define paths.
var paths = {
    distPath: 'dist',
    docsPath: 'docs',
    tempPath: 'docs/temp',
    tempTypeScriptPath: 'docs/temp/ts',
    appPath: 'docs/app',
    appMinPath: 'docs/app-min',
    componentsPath : 'src/components',
    distCompsPath : 'dist/components',
    templatePath : 'src/templates',
    dataPath: 'docs/data'
};

var storedFiles = {};
var bundleJS = require('./' + paths.docsPath + '/build/bundleJS');
var sources = require('./' + paths.docsPath + '/sources.json');
var bundles = {};

var portNum = process.env.PORT || 2020;
var url = "http://localhost";
var spacing = "\r\n";
var spaceDashes = colors.rainbow("---------------------------------------------------");
var linkTitle = colors.green("View the ") + colors.cyan('Fabric ') + colors.green('local development site here');
var completURL = spaceDashes + spacing + spacing + linkTitle + spacing +  colors.magenta(url +':' + portNum) + spacing + spacing + spaceDashes;

// Browser sync definition
var appB = require('./docs/server');

// Emit the end of the event so further pipes don't continue working
// on pipes that have bad data/files in it. Essentially, errors shouldn't cause
// tasks to exit now.
var onGulpError = function (error) {
    log.error(error);
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

// Clean out the distribution folder.
gulp.task('clean:fabric', function() {
    return del.sync([paths.distPath]);
});

// Clean out all documentation-specific paths and compiled files.
gulp.task('clean:docs', function() {
    return del.sync([
        paths.tempPath,
        paths.appPath,
        paths.appMinPath,
        'docs/components/css/docs.css',
        'docs/components/js/*.min.js',
        paths.dataPath + '/*'

    ]);
});

gulp.task('clean', ['clean:fabric', 'clean:docs']);

//
// Tasks for building Fabric for distribution.
// ----------------------------------------------------------------------------

// Copy all uncompiled LESS files and fonts to distribution folder.
gulp.task('copy', ['clean:fabric'], function () {
    // Copy LESS files.
    var less = gulp.src('src/less/*')
        .pipe(gulp.dest(paths.distPath + '/less'));

    // Copy font files.
    var fonts = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(paths.distPath + '/fonts'));

    // Copy all Components files.
    var components = gulp.src('src/components/**')
        .pipe(gulp.dest(paths.distPath + '/components'));

    return mergeStream(less, fonts, components);
});

// Build LESS files for core Fabric and Components into LTR and RTL CSS files.
gulp.task('build-less', ['clean:fabric'], function() {
    // Assemble banner for distributed CSS.
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

    var fabricTerse = gulp.src('src/less/fabric.terse.less')
            .pipe(less())
                .on('error', onGulpError)
            .pipe(rename('fabric.terse.css'))
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
            .pipe(rename('fabric.terse.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distPath + '/css/'))
                .on('error', onGulpError);    // Baseline set of tasks for building Components CSS.

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
    return mergeStream(fabric, fabricRtl, fabricTerse, components, componentsRtl, indComponents);
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

// Build up catalog to be used  
gulp.task('create-catalog-string', ['copy-components-html'], function() {
    return catalogFile =  '{ "catalog" : [' + '{ "start" : ""' + catalogContents + '}] }';
});

gulp.task('create-component-catalog', ['create-catalog-string'], folders(paths.componentsPath, function(folder) {
    return file('htmlcatalog.json', catalogFile, { src: true })
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.dataPath));
}));

// Roll up static resource building
gulp.task('build-resources', ['clean', 'copy', 'build-less', 'copy-components-html', 'build-component-examples', 'create-catalog-string', 'create-component-catalog']);

// Archive the entire distribution folder for easy distribution
gulp.task('build-fabric', ['build-resources'], function() {
    return gulp.src(paths.distPath + '/**/*')
        .pipe(zip('fabric-' + pkg.version + '.zip'))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distPath))
            .on('error', onGulpError);
});

//
// Tasks for building the documentation site.
// ----------------------------------------------------------------------------

// Copy all front-end dependencies.
gulp.task('copy-deps', ['build-fabric', 'clean:docs'], function() {
    return mergeStream(
        
       // Build dependencies
        gulp.src('bower_components/onejs/dist/amd/*.js')
            .pipe(gulp.dest('docs/app/onejs')),

        // Copy all of Fabric dist into app directory.
        gulp.src(paths.distPath + '/**/*')
            .pipe(gulp.dest('docs/app/dist')),

        // Copy all of Fabric dist into app directory.
        gulp.src('src/**/*')
            .pipe(gulp.dest('docs/app/src')),

        // Copy all Components pieces for the Components page.
        gulp.src('docs/components/**/*')
            .pipe(gulp.dest('docs/app/components')),

            // Copy all Components pieces for the Components page.
        gulp.src('docs/data/*.json')
            .pipe(gulp.dest('docs/app/data')),

        // Copy remaining resources.
        gulp.src([
            'bower_components/requirejs/require.js',
            'bower_components/knockout/dist/*.js',
            'package.json',
            'docs/src/index.html'
            ])
            .pipe(gulp.dest(paths.appPath))
    );
});

// Copy dependencies needed to build.
gulp.task('copy-build-deps', ['clean:docs'], function() {
    return mergeStream(
        gulp.src('bower_components/onejs/dist/amd/*.d.ts')
            .pipe(gulp.dest(paths.tempTypeScriptPath + '/onejs')),

        gulp.src('docs/src/**/*.ts')
            .pipe(flatten())
            .pipe(gulp.dest(paths.tempTypeScriptPath))
    );
});

// Compile & stringify all docs LESS files, then convert them to AMD modules.
gulp.task('build-docs-less', ['clean:docs', 'create-component-catalog'], function() {
    var controlsCss = gulp.src(['docs/src/controls/**/*.less'])
        .pipe(less())
            .on('error', onGulpError)
        .pipe(cssMinify())
            .on('error', onGulpError)
        .pipe(texttojs({
            template: "define(['onejs/DomUtils'], function(DomUtils) { DomUtils.loadStyles(<%= content %>); });"
        }))
            .on('error', onGulpError)
        .pipe(flatten())
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.appPath))
            .on('error', onGulpError);

    var pickerCss = gulp.src(['docs/components/css/less/docs.less'])
        .pipe(less())
            .on('error', onGulpError)
        .pipe(cssMinify())
            .on('error', onGulpError)
        .pipe(gulp.dest('docs/components/css'))
            .on('error', onGulpError);

    return mergeStream(controlsCss, pickerCss);
});

// Convert all stringified HTML templates to AMD modules.
gulp.task('build-templates', ['clean:docs'], function() {
    return gulp.src(['docs/src/controls/**/*.html'])
        .pipe(htmlMinify({
            comments: true
        }))
            .on('error', onGulpError)
        .pipe(texttojs())
            .on('error', onGulpError)
        .pipe(flatten())
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.appPath))
            .on('error', onGulpError);
});

// Compile all TypeScript files.
gulp.task('build-typescript', [ 'copy-build-deps' ], function() {
    return gulp.src(paths.tempTypeScriptPath + '/**/*.ts')
        .pipe(tsc({
            module: 'amd'
        }))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.appPath))
            .on('error', onGulpError);
});

// Build presentational Components JavaScript.
gulp.task('build-docs-js', ['clean:docs', 'create-component-catalog'], function () {
    return mergeStream(
        gulp.src('docs/components/**/*.js')
            .pipe(rename('fabric.components-picker.min.js'))
                .on('error', onGulpError)
            .pipe(uglify())
                .on('error', onGulpError)
            .pipe(gulp.dest('docs/components/js/'))
                .on('error', onGulpError),

        gulp.src('src/components/**/*.js')
            .pipe(rename('jquery.all-components.min.js'))
                .on('error', onGulpError)
            .pipe(uglify())
                .on('error', onGulpError)
            .pipe(gulp.dest('docs/components/js/'))
                .on('error', onGulpError)
   )
});

// Roll up tasks for building the docs site.
gulp.task('build-docs', [ 'build-typescript', 'build-docs-js', 'build-docs-less', 'build-templates', 'copy-deps' ]);

// Create optimized bundles for distribution.
gulp.task('build-bundles', ['build-docs'], function() {
    // Transform each defined bundle into a separate build task.
    var tasks = sources.bundles.map(function (bundle) {
        // Validate that bundle has required properties.
        if (!bundle.name) {
            throw new Error('A bundle is missing the required "name" property');
        }
        if (!bundle.out) {
            throw new Error('A bundle is missing the required "out" property');
        }

        // This will store a list of modules packed into this bundle.
        var bundleID = path.basename(bundle.out, path.extname(bundle.out));
        bundles[bundleID] = [];

        // Create r.js configuration from the bundle configuration
        var rjsConfig = {
            baseUrl: paths.appPath,
            name: bundle.name,
            out: bundle.out,
            optimize: 'none',
            include: bundle.include,
            exclude: bundle.exclude,

            onBuildWrite: function (moduleName, path, contents) {
                // r.js will invoke this callback anytime a module is writen into a bundle file
                // keep track of what modules were packed into each bundle
                bundles[bundleID].push(moduleName);
                return contents;
            },
        };

        return bundleJS(rjsConfig)
            .pipe(gulp.dest(paths.appMinPath));
    });

    // Merge all the build bundle tasks together
    var gulpStream;
    if (tasks.length > 0) {
        gulpStream = es.merge.apply(es, tasks);
    }
    return gulpStream;
});

// Create JSON manifests and bundle files for minified docs site.
gulp.task('build-manifests', ['build-bundles'], function() {
    // transform each defined manifest into a separate build task
    var tasks = sources.manifests.map(function (manifestConfig) {
        // only retrieve bundle information for bundles specified in the manifest config
        var filteredBundles = _.pick(bundles, manifestConfig.bundles);

        // Bundle files should be included as script resources in the resource manifest
        var scripts = Object.keys(filteredBundles).map(function(bundle) {
            return {
                'name': bundle,
                'path': bundle + '.js'
            };
        });

        // remove any duplicate scripts
        scripts = _.uniq(scripts);

        // remove bundles without any modules in them
        _.each(filteredBundles, function(value, key) {
            if (!value || value.length == 0) {
                delete filteredBundles[key];
            }
        });

        var manifest = {
            resources: {
                bundles: filteredBundles,
                scripts: scripts,
                scenarios: manifestConfig.scenarios
            }
        };

        // starting from 'manifest_schema.json' as a template, merge in the 'manifest' object into JSON, rename to the
        // correct filename, and place in manifests build target
        return gulp.src('./docs/build/manifest_schema.json')
            .pipe(chmod(666))
            .pipe(jeditor(manifest))
            .pipe(rename(manifestConfig.name + '.json'))
            .pipe(gulp.dest(paths.appMinPath));
    });

    // merge all the build manifest tasks together
    var gulpStream;
    if (tasks.length > 0) {
        gulpStream = es.merge.apply(es, tasks);
    }
    return gulpStream;
});

// Populate a complete minified folder for distributing the docs site.
gulp.task('bundles', [ 'build-manifests'], function() {
    return mergeStream(
        gulp.src(paths.distPath + '/**/*')
            .pipe(gulp.dest('docs/app-min/dist')),
        gulp.src('src/**/*')
            .pipe(gulp.dest('docs/app-min/src')),
        gulp.src('docs/ext/jquery/**/*')
            .pipe(gulp.dest('docs/app-min/ext/jquery')),

        gulp.src('docs/ext/prism/**/*')
            .pipe(gulp.dest('docs/app-min/ext/prism')),

        gulp.src('docs/ext/smooth-scroll/**/*')
            .pipe(gulp.dest('docs/app-min/ext/smooth-scroll')),

        gulp.src('docs/img/**/*')
            .pipe(gulp.dest('docs/app-min/img')),

        gulp.src('docs/components/**/*')
            .pipe(gulp.dest('docs/app-min/components')),

        gulp.src([
            'bower_components/requirejs/require.js',
            'docs/src/index.html',
            'package.json',
            ])
            .pipe(gulp.dest(paths.appMinPath))
    );
});

// Start a local Express server to view the site.  
gulp.task('serve', function() {
    var app = require('./docs/server');
    app.start(portNum);
});

gulp.task('serve-bsync', ['build-docs'], function() { 
    appB.startBSync(portNum);
});

//Browser sync task
gulp.task('refresh-sync', ['build-fabric', 'build-docs'], function() {
    appB.reload();
});

// Watch for changes in Fabric or docs sources, then build docs.
gulp.task('watch:docs', ['serve', 'build-all'], function() {
    console.log(completURL);
    gulp.watch(['docs/src/**/*'], batch(function(events, done) {
        runSequence('build-docs', done);
    }));
});

// Watch and build Fabric when sources change.
gulp.task('watch:fabric', ['build-fabric'], function() {
    gulp.watch('src/**/*', batch(function(events, done) {
        runSequence('build-fabric', done);
    }));
});

// Watch for changes in Fabric sources, then build Fabric.
gulp.task('watch', ['serve', 'build-all'], function() {
    console.log(completURL);
    gulp.watch(['src/**/*', 'docs/src/**/*'], batch(function(events, done) {
        runSequence('build-all', done);
    }));
});

// Watch for changes in Fabric sources and invoke browsersync.
gulp.task('watch-sync', ['build-fabric', 'build-docs', 'serve-bsync'], function() {
    gulp.watch(['src/**/*', 'docs/src/**/*'], batch(function(events, done) {
        runSequence('build-all', done);
    }));
});

//
// Default tasks.
// ----------------------------------------------------------------------------

gulp.task('build-all', ['build-fabric', 'build-docs']);
gulp.task('default', ['build-fabric']);
