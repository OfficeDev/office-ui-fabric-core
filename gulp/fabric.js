'use strict';

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
var header = require('gulp-header');
var zip = require('gulp-zip');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var template = require('gulp-template');
var concat = require('gulp-concat');
var tap = require('gulp-tap');
var data = require('gulp-data');
var folders = require('gulp-folders');
var foreach = require('gulp-foreach');
var browserSync = require('browser-sync').create();
var colors = require('colors/safe');
var path = require('path');
var wrap = require('gulp-wrap');
var uglify = require('gulp-uglify');
var nugetpack = require('gulp-nuget-pack');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');
var walkSync = require('walk-sync');
var config = require('./config')
var pkg = require('../package.json');
var size = require('gulp-size');

// Define paths.
var distPath = 'dist';
var srcPath = 'src';
var paths = {
    distPath: distPath,
    distComponents: distPath + '/components',
    distLess: distPath + '/less',
    distCSS: distPath + '/css',
    distSamples: distPath + '/samples',
    distSampleComponents: distPath + '/samples/' +  '/Components',
    distJS: distPath + '/js',
    distPackages: distPath + '/packages',
    srcPath: srcPath,
    srcSamples: srcPath + '/samples',
    componentsPath : 'src/components',
    lessPath: srcPath + '/less',
    templatePath : srcPath + '/templates',
    bundlePath: distPath + '/bundles'
};

var storedFiles = {};

//
// Build fabric banner
// ----------------------------------------------------------------------------

var date = new Date();
var monthNames = ["January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"];
var bannerTemplate = ['/**',
      ' * Office UI Fabric <%= pkg.version %>',
      ' * <%= pkg.description %>',
      ' **/',
      ''].join('\n');

// Configure data objects to pass into banner plugin.
var bannerData = {
    pkg : pkg,
    date: date,
    monthNames: monthNames
}

var banners = {
    msMessage: 'Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.',
    jsCopyRight:  function () {
        return '//' + banners.msMessage +  "\r\n";
    },
    htmlCopyRight: function () {
        return '<!-- ' +  banners.msMessage  + ' -->' + "\r\n";
    },
    cssCopyRight: function () {
        return '/* ' +  banners.msMessage  + ' */' + "\r\n";
    } 
} 

//
// Local Server Configuration and Testing Website
// ----------------------------------------------------------------------------
var portNum = process.env.PORT || 2020;
var url = "http://localhost";
var server = require('../server/server');
var rootPath = path.resolve(__dirname, '../' + paths.distSamples);


gulp.task('fabric-server', function() {
    return server.start(portNum, rootPath);
});

 
//
// Build Helpers
// ----------------------------------------------------------------------------

// Emit the end of the event so further pipes don't continue working
// on pipes that have bad data/files in it. Essentially, errors shouldn't cause
// tasks to exit now.
var onGulpError = function (error) {
    console.log(error);
    this.emit('end');
};

// Success message
var generateSuccess = function (message, showTip) {
    var spacing = "\r\n";
    var spaceDashes = colors.rainbow("---------------------------------------------------");
    if(showTip == true) {
        var tipsMessage = colors.gray("TIP: To test changes to Fabric source, check under /samples for demo HTML files of each Component.") + spacing;
    } else {
        var tipsMessage = "";
    }
    var consoleText = colors.green("Fabric Message: ") + colors.cyan(message);
    var completeMessage = spaceDashes + spacing + spacing + consoleText + spacing + tipsMessage + spacing + spaceDashes;
    return completeMessage;
}

var parseManifest = function (folder) {
    return JSON.parse(fs.readFileSync(paths.componentsPath + '/' +  folder + '/' +  folder + '.json'));
}

// Helper for retrieving folders
var getFolders = function (dir) {
    return fs.readdirSync(dir)
    .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

var buildEachComponentCss = function (destination) {
    return componentsFolders.map(function(folder) {

        var manifest = parseManifest(folder);
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
            .pipe(header(banners.cssCopyRight()))
                .on('error', onGulpError)
            .pipe(gulp.dest(destination + folder))
                .on('error', onGulpError)
            .pipe(rename(folder + '.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(header(banners.cssCopyRight()))
                .on('error', onGulpError)
            .pipe(gulp.dest(destination + folder))
                .on('error', onGulpError);
    });
}

var buildLinkContainer = function(links) {
    return '<div class="LinkContainer">'+ links +'</div>';
}

var buildLinkHtml = function (href, name) {
    var link = '<a href="' + href + '/" class="ms-Link ms-font-l ms-fontWeight-semilight ms-bgColor-neutralLighter--hover">' + name + '</a>';
    return link;
}

// Component parts
var componentsFolders = getFolders(paths.componentsPath);
var catalogContents = "";
var componentLinks = [];
var samplesLinks = "";
var samplesFolders = getFolders(paths.srcSamples);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('clean-fabric', function () {
    return del.sync([paths.distLess, paths.distCSS]);
});

gulp.task('clean-fabric-components', function () {
    return del.sync([paths.distComponents, paths.distJS]);
});

gulp.task('clean-component-samples', function () {
    return del.sync([paths.distSamples + '/Components']);
});

gulp.task('clean-samples', function () {
    return del.sync([paths.distSamples + '/*', '!' + paths.distSamples + '/{Components, Components/**}']);
});

gulp.task('clean-bundles', function () {
    return del.sync([paths.bundlePath]);
});

//
// Copying Files Tasks
// ----------------------------------------------------------------------------

// Copy all LESS files to distribution folder.
gulp.task('copy-fabric', ['clean-fabric'], function () {
    // Copy LESS files.
    return gulp.src('src/less/*')
        .pipe(gulp.dest(paths.distPath + '/less'));
});

gulp.task('copy-fabric-components', ['clean-fabric-components'], function () {
    // Copy all Components files.
    return gulp.src('src/components/**')
        .pipe(gulp.dest(paths.distComponents));
});

gulp.task('copy-component-samples', ['clean-component-samples'], function() {

    return gulp.src([
            paths.componentsPath + '/**/*.js', 
            paths.componentsPath + '/**/*.jpg', 
            paths.componentsPath + '/**/*.png', 
            paths.componentsPath + '/**/*.js',
            paths.componentsPath + '/**/*.gif'
        ])
        .pipe(gulp.dest(paths.distSamples + '/Components'));
});

gulp.task('copy-samples', ['clean-samples'], function () {
    // Copy all samples files.
    return gulp.src('src/samples/**')
        .pipe(gulp.dest(paths.distSamples));
});

// All Copy tasks
gulp.task('copy', ['copy-fabric', 'copy-fabric-components', 'copy-component-samples', 'copy-samples']);

//
// LESS tasks
// ----------------------------------------------------------------------------

// Build LESS files for core Fabric into LTR and RTL CSS files.
gulp.task('fabric-less', ['clean-fabric'], function () {
    // Configure data objects to pass into banner plugin.
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
    // Merge all current streams into one.
    return mergeStream(fabric, fabricRtl);
});

// Build Components LESS files
gulp.task('fabric-components-less', ['clean-fabric-components'], function () {

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
    // Build components CSS.
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

    // Build Fabric Components RTL CSS.
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

    var componentsCSS = buildEachComponentCss(paths.distComponents + '/');
    return mergeStream(components, componentsRtl, componentsCSS);
});

gulp.task('component-samples-less', ['clean-component-samples'], function() {
   return buildEachComponentCss(paths.distSamples + '/Components/');
});

gulp.task('samples-less', ['clean-samples'], function () {

    // Build minified Fabric Components CSS for each Component.
    return samplesFolders.map(function(folder) {

        return gulp.src(paths.srcSamples + '/' + folder + '/less/' + folder + '.less')
            .pipe(less())
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
            .pipe(gulp.dest(paths.distSamples + '/' + folder + '/css'))
                .on('error', onGulpError)
            .pipe(rename(folder + '.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify())
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.distSamples + '/' + folder + '/css'))
                .on('error', onGulpError);
    });
});

//
// JS Only tasks
// ----------------------------------------------------------------------------

gulp.task('fabric-components-js', ['clean-fabric-components'], function() {

    return gulp.src(paths.componentsPath + '/**/*.js')
        .pipe(concat('jquery.fabric.js'))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distJS))
            .on('error', onGulpError)
        .pipe(rename('jquery.fabric.min.js'))
            .on('error', onGulpError)
        .pipe(uglify())
            .on('error', onGulpError)
        .pipe(header(banners.jsCopyRight()))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distJS));
});

//
// Sample Component Building
// ----------------------------------------------------------------------------

gulp.task('reset-component-data', function() {
    componentLinks = [];
    storedFiles = {};
    componentsFolders = getFolders(paths.componentsPath);
});

gulp.task('reset-sample-data', function() {
    samplesLinks = '';
    samplesFolders = getFolders(paths.srcSamples);
});

gulp.task('build-component-data', ['clean-component-samples'], folders(paths.componentsPath, function (folder) {

    var manifest = parseManifest(folder);
    var filesArray = manifest.fileOrder;
    var wrapBranches = manifest.wrapBranches;
    var cfiles;
    var newArray;

    if(typeof manifest.fileOrder != "undefined" || manifest.fileOrder != undefined) {
        // build gulp src array
        newArray = filesArray.map(function(file, i) {
            return paths.componentsPath + '/' +  folder + '/' + file;
        });
        cfiles = gulp.src(newArray).on('error', onGulpError);
    } else {
        cfiles = gulp.src(paths.componentsPath + '/' +  folder + '/*.html').on('error', onGulpError);
    }
 
    if(manifest.wrapBranches === true) {
        cfiles.pipe(wrap('<div class="sample-wrapper"><%= contents %></div>'))
            .on('error', onGulpError)
        .pipe(concat(folder + '.html'))
            .on('error', onGulpError)
        .pipe(tap(function (file) {

             storedFiles[folder] = {
                "name": file.basename,
                "contents": file.contents.toString(),
                "files": []
            }

            var curString = file.contents.toString();
            curString = JSON.stringify(curString);

            //Check if module was already included in string
            if(catalogContents.indexOf(folder + ':') < 0) {
                componentLinks.push(buildLinkHtml('Components/' + folder, folder));
            }
        }))
        .on('error', onGulpError);
    } else {
        cfiles.pipe(concat(folder + '.html'))
            .on('error', onGulpError)
        .pipe(tap(function (file) {

            storedFiles[folder] = {
                "name": file.basename,
                "contents": file.contents.toString(),
                "files": []
            }

            var curString = file.contents.toString();
            curString = JSON.stringify(curString);
            //Check if module was already included in string
            if(catalogContents.indexOf(folder + ':') < 0) {
                componentLinks.push(buildLinkHtml('Components/' + folder, folder));
            }
        }))
            .on('error', onGulpError);
    }
    return cfiles;
}));

gulp.task('component-samples-template', ['build-component-data', 'component-samples-add-js'], folders(paths.componentsPath, function (folder) {

    return gulp.src(paths.templatePath + '/'+ 'individual-component-example.html')
            .on('error', onGulpError)
        .pipe(data(function () {
            var jstag = '';
            var files =  storedFiles[folder]["files"];
            for(var o=0; o < files.length; o++) {jstag += files[o];}
            if(typeof storedFiles[folder][folder] != "undefined") { jstag += storedFiles[folder][folder]; }
            return { "componentName": folder, "stored": storedFiles[folder].contents, "jstag": jstag };
        }))
            .on('error', onGulpError)
        .pipe(template())
            .on('error', onGulpError)
        .pipe(rename('index.html'))
            .on('error', onGulpError)
        .pipe(gulp.dest(paths.distSamples + '/Components/' +  folder))
            .on('error', onGulpError);
}));

gulp.task('component-samples-add-js', ['build-component-data'], folders(paths.componentsPath, function (folder) {

    return gulp.src(paths.componentsPath + '/' + folder + '/*.js')
            .on('error', onGulpError)
      .pipe(foreach(function(stream){
          return stream
            .pipe(tap(function(file) {
                var filename = file.path.replace(/^.*[\\\/]/, '');
                storedFiles[folder]["files"].push('<script type="text/javascript" src="' + filename+ '"></script>' + "\r\b");
            }))
            .on('error', onGulpError);
      }))
      .on('error', onGulpError);
}));

gulp.task('build-sample-data', ['clean-samples'], folders(paths.srcSamples, function (folder) {
    return gulp.src(paths.srcSamples + '/' +  folder).pipe(tap(function() {
            samplesLinks += buildLinkHtml(folder, folder);
    }));
}));


//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('build-components-page', ['clean-samples', 'build-component-data', 'build-sample-data'], function() {
    return gulp.src(paths.templatePath + '/'+ 'samples-index.html')
        .on('error', onGulpError)
    .pipe(data(function () {
        return { "components": buildLinkContainer(componentLinks.sort().join('')), "samples" :  buildLinkContainer(samplesLinks)};
    }))
        .on('error', onGulpError)
    .pipe(template())
        .on('error', onGulpError)
    .pipe(rename('index.html'))
        .on('error', onGulpError)
    .pipe(gulp.dest(paths.distSamples))
        .on('error', onGulpError);
}); 

// gulp.task('index-build-all', ['build-components-page']);

//
// Packaging tasks
// ----------------------------------------------------------------------------
gulp.task('nuget-pack', function(callback) {
    nugetpack({
            id: "OfficeUIFabric",
            title: "Office UI Fabric",
            version: pkg.version,
            authors: "Microsoft Corporation",
            owners: "Microsoft Corporation",
            description: "Fabric is a responsive, mobile-first, front-end framework, designed to make it quick and simple for you to create web experiences using the Office Design Language. It’s easy to get up and running with Fabric—whether you’re creating a new Office experience from scratch or adding new features to an existing one.",
            summary: "The front-end framework for building experiences for Office and Office 365.",
            language: "en-us",
            projectUrl: "https://github.com/OfficeDev/Office-UI-Fabric",
            licenseUrl: "https://github.com/OfficeDev/Office-UI-Fabric/blob/master/LICENSE",
            copyright: "Copyright (c) Microsoft Corporation",
            requireLicenseAcceptance: true,
            tags: "Microsoft UI Fabric CSS",
            outputDir: paths.distPackages
        },

        [
            {src: paths.componentsPath, dest: "/content/components/"},
            {src: paths.distCSS, dest: "/content/css/"},
            {src: paths.distJS, dest: "/content/scripts/"},
            {src: paths.distLess, dest: "/content/less/"}
        ],

        callback
    );
});


// Flat list of paths for each file that should be included in a bundle.
var bundleFilePaths = [];

gulp.task('build-bundles-data', ['clean-bundles'], function() {
    let bundleSpecs = config.bundles;

    if (bundleSpecs.length > 0) {
        for (let i = 0; i < bundleSpecs.length; i++) {
            let bundleConfig = bundleSpecs[i];
            let bundleName = bundleConfig.name;
            let includes = bundleConfig.includes || [];
            let excludes = bundleConfig.excludes || [];
            let options = bundleConfig.options || {};

            bundleFilePaths[i] = {
                'name': bundleName,
                'files': []
            }

            // The manner in which a bundle's LESS file will be assembled.
            // 
            // "exclude": Builds all LESS files under /src and /components
            //            except those listed in a bundle's "excludes" property.
            // "include": Builds only the the LESS files listed in a bundle's 
            //            "includes" property. Note that if an include has dependency 
            //            LESS files, those will be included as well.
            // "full":    Builds all LESS files. Only runs if no includes or 
            //            excludes are defined.
            let bundleMode = () => {
                let _mode = '';

                if (excludes !== undefined && excludes.length > 0) {
                    _mode = 'exclude';
                } else if (includes !== undefined && includes.length > 0) {
                    _mode = 'include'; 
                } else if ((!excludes || excludes === undefined || excludes.length === 0) || 
                         (!includes || includes === undefined || includes.length === 0)) {
                    _mode = 'full';
                }

                if (options.verbose) {
                    console.log(colors.yellow('Building ' + colors.green(bundleName) + ' bundle in "' + colors.green(_mode) + '" bundle mode.'));
                }

                return _mode;
            }();

            let srcFolders = getFolders(paths.srcPath).filter((folderName) => {
                let foldersToSearch = ['less', 'components']

                return foldersToSearch.indexOf(folderName) !== -1;
            });

            srcFolders.forEach(function(dir) {
                // Grab all LESS and JSON files as stats objects
                let entries = walkSync.entries(paths.srcPath + '\\' + dir,  { globs: ['**/*.less', '**/*.json'] });

                // Cache Component manifests for includes and/or dependencies.
                let cachedManifests = {};

                entries.forEach((entry) => {
                    let entryFileName = entry.relativePath.split('/').slice(-1).join(''); // e.g. Button.less
                    let entryName = entryFileName.replace('.json', ''); // e.g. Button
                    let isEntryInclude = includes !== undefined && includes.indexOf(entryName) >= 0;
                    let extension = path.extname(entryFileName);
                    let entryBasePath = entry.basePath.replace('\\','/');

                    // Read children
                    if (extension === '.json' && isEntryInclude) {
                        // Manifest of an entry
                        let includeManifest = JSON.parse(fs.readFileSync(entryBasePath + '/' + entryName + '/' + entryFileName));

                        // Sniff child deps
                        if (includeManifest['dependencies'] && includeManifest['dependencies'].length > 0) {
                            includeManifest['dependencies'].forEach((dep) => {
                                // Manifest of an dependency
                                let depManifest = JSON.parse(fs.readFileSync(entryBasePath + '/' + dep + '/' + dep + '.json'));

                                // Include the dependency's manifest if it hasn't been added already
                                if (!cachedManifests.hasOwnProperty(dep)) {
                                    cachedManifests[dep] = depManifest;
                                }
                            })
                        }

                        cachedManifests[entryName] = includeManifest;
                    }

                    return extension === '.json' && isEntryInclude;
                });


                // Return a collection of the files listed in the config
                let filteredEntries = entries.filter(function(entry) {
                    let entryFileName = entry.relativePath.split('/').slice(-1).join(''); // e.g. Button.less
                    let entryName = entryFileName.replace('.less', ''); // e.g. Button
                    let entryBasePath = entry.basePath.replace('\\','/'); // e.g. src/components
                    let extension = path.extname(entryFileName);

                    // Only process LESS files
                    if (extension === '.less') {
                        // Excludes are defined--prefer those first.
                        if (excludes !== undefined && excludes.length > 0) {
                            // Include the entry only if it is not listed as an exclude
                            let includeEntry = excludes.indexOf(entryName) < 0;

                            if (!includeEntry && options.verbose) {
                                console.log(colors.green('Excluded ' + entryName + '.less from ' + bundleName + ' bundle.'));
                            }

                            return includeEntry;
                        } 


                        // Includes are specified, but exludes are not. 
                        else if (includes !== undefined && includes.length >= 0 || bundleMode === 'include') {
                            // The current entry is a Fabric Component
                            let isEntryComponent = entryBasePath === paths.componentsPath;

                            // The current entry is listed as an include
                            let isEntryInclude = includes.indexOf(entryName) >= 0;

                            // Current entry is a dependency of an include
                            let isEntryDependency = (function() {
                                if (isEntryComponent) {
                                    for (var l = 0; l < includeManifests.length; l++) {
                                        if (includeManifests[l]['dependencies']) {
                                            var _deps = includeManifests[l]['dependencies'] || [];

                                            // Returns true only if current entry is listed as a dependency of an include
                                            return _deps.indexOf(entryName) >= 0;
                                        }
                                    }
                                } else {
                                    return false;
                                }
                            })();

                            // Include the current entry straightaway if the entry is an include
                            if (includes.indexOf(entryName) >= 0) {
                                return true;
                            }

                            // Include the current entry if it is a Component and a dependency of an include
                            if (isEntryComponent && isEntryDependency) {
                                console.log(colors.yellow(entryName + ' included as a dependency of an include.'));
                                return true;
                            }
                        } 

                        // If neither includes nor excludes are defined, just make a full build
                        else if ((excludes === undefined || excludes.length === 0) && 
                                 (includes === undefined || includes.length === 0)) {
                            return true;
                        }
                    }
                }).map(function(entry) {
                    var entryFileName = entry.relativePath.split('/').slice(-1).join('');
                    var entryName = entryFileName.replace('.less', ''); // e.g. Button
                    var entryBasePath = entry.basePath.replace('\\','/');
                    var isEntryComponent = entryBasePath === paths.componentsPath;
                    var relativePath = '../';
                    var fullPath = relativePath + entryBasePath;

                    if (isEntryComponent) {
                        fullPath += '/' + entryName;
                    }

                    fullPath += '/' + entryFileName;
                    fullPath = fullPath.replace('src/', '');

                    bundleFilePaths[i]['files'].push(fullPath);

                    return fullPath;
                });
            });
        }
    } else {
        console.log(colors.red('No bundles configured.'));
    }
});

gulp.task('build-bundles', ['build-bundles-data'], function() {
    let bundleSpecs = config.bundles;

    // Start processing bundles only if configured
    if (bundleSpecs.length > 0) {
        let _filesList = function(i) {
            return bundleFilePaths[i]['files'];
        }

        let bundleBase = function(index, bundleName) {
            return gulp.src(paths.templatePath + '/'+ 'bundle-template.less')
            .pipe(data(function () {
                var filesList = _filesList(index);

                return { 
                    'files': filesList 
                };
            }))
                .on('error', onGulpError)
            .pipe(template())
                .on('error', onGulpError)
            .pipe(template())
            .pipe(rename(bundleName + '.less'))
            .pipe(gulp.dest(paths.bundlePath + '/' + bundleName ))
            .pipe(less())
                .on('error', onGulpError)
            .pipe(header(bannerTemplate, bannerData))
                .on('error', onGulpError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(rename(bundleName + '.css'))
                .on('error', onGulpError)
            .pipe(cssbeautify())
                .on('error', onGulpError)
            .pipe(csscomb())
                .on('error', onGulpError)
            .pipe(header(banners.cssCopyRight()))
                .on('error', onGulpError)
            .pipe(size({
                'showFiles': true
            }))
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.bundlePath + '/' + bundleName))
                .on('error', onGulpError)
            .pipe(rename(bundleName + '.min.css'))
                .on('error', onGulpError)
            .pipe(cssMinify({
                 'aggressiveMerging': false
            }))
                .on('error', onGulpError)
            .pipe(header(banners.cssCopyRight()))
                .on('error', onGulpError)
            .pipe(size({
                'showFiles': true
            }))
                .on('error', onGulpError)
            .pipe(gulp.dest(paths.bundlePath + '/' + bundleName))
                .on('error', onGulpError);            
        }

        let bundleConfig;
        let bundleName;

        for (let i = 0; i < bundleSpecs.length; i++) {
            bundleConfig = bundleSpecs[i];
            bundleName = bundleConfig.name;

            bundleBase(i, bundleName);
        }
    } else {
        console.log(colors.red('No bundles configured.'));
    }
});

gulp.task('reset-bundles-data', function() {
    bundleFilePaths = [];
});



//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

gulp.task('build-fabric', ['clean-fabric', 'copy-fabric', 'fabric-less']);

// Build for Fabric component demos
gulp.task('build-fabric-components', ['clean-fabric-components', 'copy-fabric-components', 'fabric-components-less', 'fabric-components-js']);

//Build Fabric Component Samples
gulp.task('build-component-samples', ['clean-component-samples', 'copy-component-samples', 'component-samples-less', 'build-component-data', 'component-samples-template']);

// Roll up for samples
gulp.task('build-samples', ['clean-samples', 'copy-samples', 'samples-less']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('fabric-finished', ['build-fabric'], function () {
    console.log(generateSuccess('Fabric core-build complete, you may now celebrate and dance!', true));
});

gulp.task('fabric-updated', ['build-fabric'], function () {
    console.log(generateSuccess(' Fabric updated successfully', false));
});

gulp.task('fabric-components-finished', ['build-fabric-components'], function () {
    console.log(generateSuccess(' Components build was successful! Yay!', true));
});

gulp.task('fabric-components-updated', ['build-fabric-components'], function () {
    console.log(generateSuccess(' Components updated successfully! Yay!'));
});

gulp.task('component-samples-finished', ['build-component-samples'], function () {
    console.log(generateSuccess(' Component Samples build was successful! Yay!', true));
});

gulp.task('component-samples-updated', ['build-component-samples'], function () {
    console.log(generateSuccess(' Components Samples updated successfully! Yay!'));
});

gulp.task('fabric-all-finished', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('All Fabric parts built successfully, you may now celebrate and dance!', true));
});

gulp.task('fabric-all-server', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric samples located at ' + url + ':' + portNum, false));
});

gulp.task('fabric-all-updated', ['build-fabric', 'build-fabric-components', 'build-samples'], function () {
    console.log(generateSuccess('All Fabric parts updated successfully! Yay!', true));
});

gulp.task('samples-finished', ['build-samples'], function () {
    console.log(generateSuccess('Samples done, experience fabric by sample!', true));
});

gulp.task('samples-updated', ['build-samples'], function () {
    console.log(generateSuccess(' Samples done updating', false));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watch and build Fabric when sources change.
gulp.task('watch:fabric', ['build-fabric', 'fabric-finished'], function () {
    return gulp.watch(paths.lessPath + '/**/*', batch(function (events, done) {
        runSequence('build-fabric', 'fabric-updated', done);
    }));
});

// Watches all src fabric components and builds fabric.components.
gulp.task('watch:fabric-components', ['build-fabric-components', 'fabric-components-finished'], function () {
    return gulp.watch(paths.componentsPath + '/**/*', batch(function (events, done) {
        runSequence('build-fabric-components', 'fabric-components-updated', done);
    }));
});

// Watches all src fabric components but, builds the samples only
gulp.task('watch:component-samples', ['build-component-samples', 'build-components-page', 'fabric-server',  'fabric-all-server'], function () {
    return gulp.watch(paths.componentsPath + '/**/*', batch(function (events, done) {
        runSequence('build-component-samples', done);
    }));
});

// Watch and build Fabric when sources change.
gulp.task('watch:samples', ['build-samples', 'samples-finished'], function () {
    return gulp.watch(paths.srcSamples + '/**/*', batch(function (events, done) {
        runSequence('build-samples', 'samples-updated', done);
    }));
});

// Watch components and Fabric at the same time but build separately.
gulp.task('watch:separately', ['build-fabric', 'build-fabric-components', 'fabric-finished'], function () {
    gulp.watch(paths.lessPath + '/**/*', batch(function (events, done) {
        runSequence('build-fabric', 'fabric-updated', done);
    }));

    gulp.watch(paths.componentsPath + '/**/*', batch(function (events, done) {
        runSequence('build-component-samples', 'component-samples-updated', done);
    }));

    gulp.watch(paths.srcSamples + '/**/*', batch(function (events, done) {
        runSequence('build-samples', 'samples-updated', done);
    }));
});

var watchTasks = [
    'build-fabric', 
    'build-fabric-components', 
    'build-component-samples', 
    'build-samples', 
    'build-components-page', 
    'fabric-server', 
    'fabric-all-server'
];

// Watch and build Fabric when sources change.
gulp.task('watch', watchTasks, function () {
    gulp.watch(paths.srcPath + '/**/*', batch(function (events, done) {
        runSequence('re-build', done);
    }));
});

//
// Default Build
// ----------------------------------------------------------------------------

gulp.task('build', ['build-fabric', 'build-fabric-components', 'build-component-samples', 'build-samples', 'build-components-page', 'fabric-all-finished']); 
gulp.task('re-build', ['reset-sample-data', 'reset-component-data', 'build-fabric', 'build-fabric-components', 'build-component-samples', 'build-samples', 'build-components-page', 'fabric-all-finished']); 

