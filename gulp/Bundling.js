'use strict';

var gulp = require('gulp');
var pkg = require('../package.json');

// Fabric Helper Modules
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var ComponentHelper = require('./modules/ComponentHelper');
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
var sass = Plugins.sass;
var header = Plugins.header;
var autoprefixer = Plugins.autoprefixer;
var cssbeautify = Plugins.cssbeautify;
var csscomb = Plugins.csscomb;
var cssMinify = Plugins.cssMinify;
var gulputil = Plugins.gutil;


//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

// Clean out the distribution folder.
gulp.task('Bundles-nuke', function () {
    return Plugins.del.sync([Config.paths.bundlePath]);
});

// Flat list of paths for each file that should be included in a bundle.
var bundleFilePaths = [];

// Assemble collection of file paths for each entry of each specified bundle.
// This task populates bundleFilePaths, from which each bundle's SASS file is 
// generated.
gulp.task('Bundles-buildData', function() {
    let allBundleSpecs = Config.bundlesConfig.bundles;

    if (allBundleSpecs.length > 0) {
        // Cache number of bundles specified in Config.js.
        let bundleSpecsLength = allBundleSpecs.length;

        // Iterate over each bundle to assemble the appropriate data for it.
        for (let i = 0; i < bundleSpecsLength; i++) {
            let bundleConfig = allBundleSpecs[i];
            let bundleName = bundleConfig.name;
            let includes = bundleConfig.includes || [];
            let excludes = bundleConfig.excludes || [];
            let options = bundleConfig.options || {};

            // The name of each bundle and the paths to each file included.
            bundleFilePaths[i] = {
                'name': bundleName,
                'files': []
            }

            // The manner in which a bundle's SASS file will be assembled.
            // 
            // "exclude": Builds all SASS files under /src and /components
            //            except those listed in a bundle's "excludes" property.
            // "include": Builds only the the SASS files listed in a bundle's 
            //            "includes" property. Note that if an include has dependency 
            //            SASS files, those will be included as well.
            // "full":    Builds all SASS files. Only runs if no includes or 
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
            };

            // Walk the SASS and components folders.
            let srcFolders = Utilities.getFolders(Config.paths.src).filter((folderName) => {
                let foldersToSearch = ['sass', 'components']

                return foldersToSearch.indexOf(folderName) !== -1;
            });

            // Iterate over each folder and grab all of the SCSS and JSON files.
            // We'll work with these to determine which files to include or exclude.
            srcFolders.forEach(function(dir) {
                // Grab all SCSS and JSON files as fs.stats objects.
                let entries = Plugins.walkSync.entries(Config.paths.src + '/' + dir,  { globs: ['**/*.scss',"!**/_Fabric.*.scss", '**/*.json'] });
                // Cache Component manifests for includes and/or dependencies.
                let cachedManifests = {};

                // Walk each entry to determine if it has a manifest, which we
                // use to determine any dependency components.
                entries.forEach((entry) => {
                    let entryFileName = entry.relativePath.split('/').slice(-1).join(''); // e.g. Button.scss
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

                // Return a collection of the files listed in the bundle's config
                // and any dependencies.
                let filteredEntries = entries.filter(function(entry) {
                    // The full name of the file with extension, e.g. Button.scss
                    let entryFileName = entry.relativePath.split('/').slice(-1).join('');

                    // Just the name of the file without the extension, e.g. Button
                    let entryName = entryFileName.replace('.scss', '');

                    // Just the base directory the file was included in, e.g. src/components
                    let entryBasePath = entry.basePath.replace('\\','/');

                    // The file's isolated extension, either .scss or .json.
                    let extension = path.extname(entryFileName);

                    // Only process SCSS files.
                    if (extension === '.scss' && 
                        entryFileName !== 'Fabric.scss' && 
                        entryFileName !== 'Fabric.Components.scss') {
                        // For now, strip out RTL. These will need to be handled separately.
                        if (entryFileName.indexOf('.RTL') >= 0) {
                            if (options.logWarnings) {
                                gulputil.log(colors.yellow(entryFileName) + ' not included. Bundling of RTL files is not currently supported.');
                            }

                            return false;
                        }

                        // Exclude partials, whose output shouldn't be compiled.
                        if (entryFileName[0] === '_') {
                            return false;
                        }

                        // If excludes are defined, those should take precedence.
                        if (bundleMode === 'exclude') {
                            // Return the entry only if it is not listed as an exclude.
                            let shouldIncludeEntry = excludes.indexOf(entryName) < 0;

                            if (!shouldIncludeEntry && options.verbose) {
                                gulputil.log('Excluded ' + colors.green(entryName + '.scss') + ' from ' + colors.green(bundleName) + ' bundle.');
                            }

                            return shouldIncludeEntry;
                        } 

                        // Otherwise, run in "include" mode if it is specified.
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

                        // If neither includes nor excludes are defined, simply run a full build.
                        else if (bundleMode === 'full') {
                            return true;
                        }
                    }
                })

                // Then, assemble a final list of paths for each file that will
                // be pushed into the SASS template.
                .map(function(entry) {
                    let entryFileName = entry.relativePath.split('/').slice(-1).join('');
                    let entryName = entryFileName.replace('.scss', '');
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
        // Generic build for SASS bundle file.
        let bundleBase = function(index, bundleName) {
            return ComponentHelper.buildComponentStyles(
                // destFolder
                Config.paths.bundlePath + '/' + bundleName, 

                // srcTemplate
                Config.paths.templatePath + '/'+ 'bundle-template.scss', 

                // componentName 
                bundleName, 

                // deps
                bundleFilePaths[index]['files'], 

                // BuildConfig
                BuildConfig.processorPlugin,
                BuildConfig.processorName,
                BuildConfig.compileErrorHandler,

                // showSize
                true,

                // outputSass
                true
           );
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

var tasks = [
    'Bundles-nuke',
    'Bundles-buildData', 
    'Bundles-build'
];

gulp.task('Bundles', tasks);
BuildConfig.buildTasks.push('Bundles');
