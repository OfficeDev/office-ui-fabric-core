'use strict';

var gulp = require('gulp');
var gulputil = require('gulp-util');
var pkg = require('../package.json');

// Fabric Helper Modules
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');

// Local plugin aliases
var colors = Plugins.colors;
var fs = Plugins.fs;
var path = Plugins.path;
var size = Plugins.size;
var data = Plugins.data;
var template = Plugins.template;
var rename = Plugins.rename;
var less = Plugins.less;
var header = Plugins.header;
var autoprefixer = Plugins.autoprefixer;
var cssbeautify = Plugins.cssbeautify;
var csscomb = Plugins.csscomb;
var cssMinify = Plugins.cssMinify;


//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('Bundles-nuke', function () {
    return Plugins.del.sync([Config.paths.bundlePath]);
});


// Flat list of paths for each file that should be included in a bundle.
var bundleFilePaths = [];

gulp.task('Bundles-buildData', function() {
    let allBundleSpecs = Config.bundlesConfig.bundles;

    if (allBundleSpecs.length > 0) {
        // Cache length
        let bundleSpecsLength = allBundleSpecs.length;

        for (let i = 0; i < bundleSpecsLength; i++) {
            let bundleConfig = allBundleSpecs[i];
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
                    gulputil.log(colors.yellow('Building ' + colors.green(bundleName) + ' bundle in "' + colors.green(_mode) + '" bundle mode.'));
                }

                return _mode;
            }();

            let srcFolders = Utilities.getFolders(Config.paths.srcPath).filter((folderName) => {
                let foldersToSearch = ['less', 'components']

                return foldersToSearch.indexOf(folderName) !== -1;
            });

            srcFolders.forEach(function(dir) {
                // Grab all LESS and JSON files as stats objects
                let entries = Plugins.walkSync.entries(Config.paths.srcPath + '\\' + dir,  { globs: ['**/*.less', '**/*.json'] });

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
                });

                // Return a collection of the files listed in the bundle's config.
                let filteredEntries = entries.filter(function(entry) {
                    let entryFileName = entry.relativePath.split('/').slice(-1).join(''); // e.g. Button.less
                    let entryName = entryFileName.replace('.less', ''); // e.g. Button
                    let entryBasePath = entry.basePath.replace('\\','/'); // e.g. src/components
                    let extension = path.extname(entryFileName);

                    // Only process LESS files
                    if (extension === '.less' && 
                        entryFileName !== 'Fabric.less' && 
                        entryFileName !== 'Fabric.Components.less') {
                        // For now, strip out RTL. These will need to be handled separately.
                        if (entryFileName.indexOf('.RTL') >= 0) {
                            if (options.logWarnings) {
                                gulputil.log(colors.yellow(entryFileName) + ' not included. Bundling of RTL files is not currently supported.');
                            }

                            return false;
                        }

                        // If excludes are defined, those should take precedence.
                        if (bundleMode === 'exclude') {
                            // Return the entry only if it is not listed as an exclude
                            let shouldIncludeEntry = excludes.indexOf(entryName) < 0;

                            if (!shouldIncludeEntry && options.verbose) {
                                gulputil.log('Excluded ' + colors.green(entryName + '.less') + ' from ' + colors.green(bundleName) + ' bundle.');
                            }

                            return shouldIncludeEntry;
                        } 


                        else if (bundleMode === 'include') {
                            // The current entry is a Fabric Component if it's 
                            // in the /components folder.
                            let isEntryComponent = entryBasePath === Config.paths.componentsPath;

                            // The current entry is listed as an include for the bundle.
                            let isEntryInclude = includes.indexOf(entryName) >= 0;

                            // The current entry is listed as a dependency, 
                            // either of an include or of an include's dependency.
                            let isEntryDependency = isEntryComponent ? cachedManifests.hasOwnProperty(entryName) : false;


                            // Include the current entry straightaway if the entry is an include
                            if (includes.indexOf(entryName) >= 0) {
                                return true;
                            }

                            // Include the current entry if it is a Component and a dependency of an include
                            if (isEntryComponent && isEntryDependency) {
                                if (options.verbose) {
                                    gulputil.log(colors.yellow(entryName) + ' included as a dependency of an include in ' + colors.green(bundleName) + '.');
                                }

                                return true;
                            }
                        } 

                        // If neither includes nor excludes are defined, just make a full build
                        else if (bundleMode === 'full') {
                            return true;
                        }
                    }
                }).map(function(entry) {
                    let entryFileName = entry.relativePath.split('/').slice(-1).join('');
                    let entryName = entryFileName.replace('.less', '');
                    let entryBasePath = entry.basePath.replace('\\','/');
                    let isEntryComponent = entryBasePath === Config.paths.componentsPath;
                    let fullPath = entryBasePath;

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
        gulputil.log(colors.red('No bundles configured.'));
    }
});

gulp.task('Bundles-build', function() {
    let allBundleSpecs = Config.bundlesConfig.bundles;

    if (allBundleSpecs.length > 0) {
        let _filesList = (i) => {
          return bundleFilePaths[i]['files'];
        }

        // console.log(_filesList());

        // Core Fabric files that should be included by reference for their variables
        // if they are not explicitly included
        let _coreLessFiles = [
            '_Fabric.Utilities',
            '_Fabric.ZIndex.Variables',
            '_Fabric.Mixins',
            '_Fabric.Color.Variables',
            '_Fabric.Color.Mixins',
            '_Fabric.Typography.Variables',
            '_Fabric.Typography',
            '_Fabric.Typography.Fonts',
            '_Fabric.Typography.Languageoverrides',
            '_Fabric.Icons.Font',
            '_Fabric.Icons',
            '_Fabric.Animations',
            '_Fabric.Responsive.Variables',
            '_Fabric.Responsive.Utilities',
            '_Fabric.Grid',
            '_Office.Color.Variables',
            '_Office.Color.Mixins'
        ].map((file) => {
            return 'less/' + file + '.less';
        });

        let bundleBase = function(index, bundleName) {
            let bundleDescription = allBundleSpecs[index].description;

            let bundleBannerData = {
                pkg : pkg,
                bundleDescription: bundleDescription || pkg.description
            }

            return gulp.src(Config.paths.templatePath + '/'+ 'bundle-template.less')
            // .pipe(Plugins.plumber(ErrorHandling.onErrorInPipe))
            .pipe(data(function () {
                let filesList = _filesList(index);

                return { 
                    'files': filesList,
                    'coreFiles': _coreLessFiles
                };
            }))
            .pipe(template())
            .pipe(rename(bundleName + '.less'))
            .pipe(gulp.dest(Config.paths.bundlePath + '/' + bundleName ))
            .pipe(less())
            .pipe(header(Banners.bundleBannerTemplate(), bundleBannerData))
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(rename(bundleName + '.css'))
            .pipe(cssbeautify())
            .pipe(csscomb())
            .pipe(header(Banners.getCSSCopyRight()))
            .pipe(size({
                'showFiles': true
            }))
            .pipe(gulp.dest(Config.paths.bundlePath + '/' + bundleName))
            .pipe(rename(bundleName + '.min.css'))
            .pipe(cssMinify({
                 'aggressiveMerging': false
            }))
            .pipe(header(Banners.getCSSCopyRight()))
            .pipe(size({
                'showFiles': true
            }))
            .pipe(gulp.dest(Config.paths.bundlePath + '/' + bundleName));            
        }

        let bundleConfig;
        let bundleName;
        let bundleSpecsLength = allBundleSpecs.length;

        // Run the bundle base build for each define bundle.
        for (let i = 0; i < bundleSpecsLength; i++) {
            bundleConfig = allBundleSpecs[i];
            bundleName = bundleConfig.name;
            bundleBase(i, bundleName);
        }
    } else {
        gulputil.log(colors.red('No bundles configured.'));
    }
});

gulp.task('Bundles-resetData', function() {
    bundleFilePaths = [];
});

gulp.task('Bundles-buildAll', function() {
  Plugins.runSequence('Bundles-nuke','Bundles-buildData', 'Bundles-build');
});
