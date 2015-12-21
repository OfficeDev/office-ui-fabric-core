var gulp = require('gulp');
var fs = require('fs');

var utilities = require('./modules/Utilities');
var banners = require('./modules/Banners');
var fabricServer = require('./modules/Server');
var config = require('./modules/Config');
var messaging = require('./modules/Messaging');
var errorHandling = require('./modules/ErrorHandling');
var plugins = require('./modules/Plugins');
var FoldersModel = require('./models/FoldersModel');
var storedFiles = {};


var buildEachComponentCss = function (destination) {
    return componentsFolders.map(function(folder) {

        var manifest = utilities.parseManifest(folder);
        var deps = manifest.dependencies || [];

        return gulp.src(config.paths.templatePath + '/'+ 'component-manifest-template.less')
            .pipe(plugins.data(function () {
                return { "componentName": folder, "dependencies": deps };
            }))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.template())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.less())
                .on('error', errorHandling.onErrorInPipe)
             .pipe(plugins.header(banners.getBannerTemplate(), banners.getBannerData()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(plugins.rename(folder + '.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssbeautify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.csscomb())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getCSSCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destination + folder))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.rename(folder + '.min.css'))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.cssMinify())
                .on('error', errorHandling.onErrorInPipe)
            .pipe(plugins.header(banners.getCSSCopyRight()))
                .on('error', errorHandling.onErrorInPipe)
            .pipe(gulp.dest(destination + folder))
                .on('error', errorHandling.onErrorInPipe);
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
var componentsFolders = utilities.getFolders(config.paths.componentsPath);
var catalogContents = "";
var componentLinks = [];
var samplesLinks = "";
var samplesFolders = utilities.getFolders(config.paths.srcSamples);

//
// Clean/Delete Tasks
// ----------------------------------------------------------------------------

gulp.task('clean-component-samples', function () {
    return plugins.del.sync([config.paths.distSamples + '/Components']);
});


//
// Copying Files Tasks
// ----------------------------------------------------------------------------

gulp.task('copy-component-samples', ['clean-component-samples'], function() {

    return gulp.src([
            config.paths.componentsPath + '/**/*.js', 
            config.paths.componentsPath + '/**/*.jpg', 
            config.paths.componentsPath + '/**/*.png', 
            config.paths.componentsPath + '/**/*.js',
            config.paths.componentsPath + '/**/*.gif'
        ])
        .pipe(gulp.dest(config.paths.distSamples + '/Components'));
});

//
// LESS tasks
// ----------------------------------------------------------------------------

gulp.task('component-samples-less', ['clean-component-samples'], function() {
   return buildEachComponentCss(config.paths.distSamples + '/Components/');
});

//
// Sample Component Building
// ----------------------------------------------------------------------------

gulp.task('reset-component-data', function() {
    componentLinks = [];
    storedFiles = {};
    componentsFolders = utilities.getFolders(config.paths.componentsPath);
});

gulp.task('build-component-data', ['clean-component-samples'], plugins.folders(config.paths.componentsPath, function (folder) {

    var manifest = utilities.parseManifest(folder);
    var filesArray = manifest.fileOrder;
    var cfiles;
    var newArray;

    if(typeof manifest.fileOrder != "undefined" || manifest.fileOrder != undefined) {
        // build gulp src array
        newArray = filesArray.map(function(file, i) {
            return config.paths.componentsPath + '/' +  folder + '/' + file;
        });
        cfiles = gulp.src(newArray).on('error', errorHandling.onErrorInPipe);
    } else {
        cfiles = gulp.src(config.paths.componentsPath + '/' +  folder + '/*.html').on('error', errorHandling.onErrorInPipe);
    }
 
    if(manifest.wrapBranches === true) {
        cfiles.pipe(plugins.wrap('<div class="sample-wrapper"><%= contents %></div>'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.concat(folder + '.html'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.tap(function (file) {

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
        .on('error', errorHandling.onErrorInPipe);
    } else {
        cfiles.pipe(plugins.concat(folder + '.html'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.tap(function (file) {

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
            .on('error', errorHandling.onErrorInPipe);
    }
    return cfiles;
}));

gulp.task('component-samples-template', ['build-component-data', 'component-samples-add-js'], plugins.folders(config.paths.componentsPath, function (folder) {

    return gulp.src(config.paths.templatePath + '/'+ 'individual-component-example.html')
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.data(function () {
            var jstag = '';
            var files =  storedFiles[folder]["files"];
            for(var o=0; o < files.length; o++) {jstag += files[o];}
            if(typeof storedFiles[folder][folder] != "undefined") { jstag += storedFiles[folder][folder]; }
            return { "componentName": folder, "stored": storedFiles[folder].contents, "jstag": jstag };
        }))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.template())
            .on('error', errorHandling.onErrorInPipe)
        .pipe(plugins.rename('index.html'))
            .on('error', errorHandling.onErrorInPipe)
        .pipe(gulp.dest(config.paths.distSamples + '/Components/' +  folder))
            .on('error', errorHandling.onErrorInPipe);
}));

gulp.task('template-components', function() {
   
   var folderList = utilities.getFolders(config.paths.componentsPath);
   var streams = [];
    for(var i=0; i < folderList.length; i++) {
       
    // var currentFolder = FoldersModel.componentFolders[i];
    //    var folderName = FoldersModel.componentFolders[i]["folderName"];
    //    var currentFiles = currentFolder["files"];
    //    var fileHasChanged = false;
    //    var foldersHaveBeenAdded = FoldersModel.hasCatalogBeenCreated();
       
    //    for(var x=0; x < currentFiles.length; x++) {
    //        var currentFile = currentFiles[x];
    //        var currentFileName = currentFile.fileName;
    //        var modifiedTime = currentFile.modifiedTime;
    //        var newModifiedTime = utilities.getFileModifiedTime(folderName + '/' + currentFileName);
    //        console.log(modifiedTime.getTime(), newModifiedTime.getTime());
    //        if(modifiedTime.getTime() < newModifiedTime.getTime()) {
    //            // Add this folder to the pipe
    //            fileHasChanged = true;
    //        }
    //    }
    
       var folderName = folderList[i];
       var srcFolderName = config.paths.componentsPath + '/' + folderName;
       var distFolderName = config.paths.distSampleComponents + '/' + folderName;
       
       var hasFileChanged = utilities.hasFileChangedInFolder(srcFolderName, distFolderName);
       var mergedStreams = plugins.mergeStream();
       
       console.log(hasFileChanged);
       
       if(hasFileChanged) {
           //Create a pipe with the whole folder
           
           // Glob all files together
           // Check if they need to be wrapped
           // Concat them
           // Run stuff
           
           var manifest = utilities.parseManifest(folderName);
           var filesArray = manifest.fileOrder;
           var componentPipe;
           
           var fileGlob = utilities.getManifestFileList(filesArray, config.paths.componentsPath + '/' + folderName);
           
           componentPipe = gulp.src(fileGlob);
           
           if(manifest.wrapBranches == true) {
               componentPipe.pipe(plugins.wrap('<div class="sample-wrapper"><%= contents %></div>'))
           }
           // Combine all files in the pipe
           componentPipe.pipe(plugins.concat("index.html"));
           
           // Wrap all combined files with template
           componentPipe.pipe(plugins.wrap({
               src: config.paths.templatePath + '/componentSamplesTemplate.html',
               data: {
                   componentName: folderName
               }
           }));
           
           // Add Debugging
           componentPipe.pipe(plugins.debug());
           
           //Rename the files
           // componentPipe.pipe(plugins.rename('index.html'));
           
           // Move the files to a new location now
           componentPipe.pipe(gulp.dest(config.paths.distSamples + '/Components/' +  folderName));
           
           // Add stream
           //mergedStreams.add(componentPipe);
           streams.push(componentPipe);
           
       }
   }
   
});


//New Ultra fast Gulp task
gulp.task('catalog-components', function() {
    
    var folderList = utilities.getFolders(config.paths.componentsPath);
    for(var i=0; i < folderList.length; i++) {
        
        var currentFolderName = config.paths.componentsPath + '/' + folderList[i];
        var folderName = folderList[i];
        var folderIndex = FoldersModel.getFolderIndex(FoldersModel.componentFolders, currentFolderName);
        var distFolder = false;
        
        // Check if dist folder actually exists, if not then remove it from the catalog
        try {
            fs.statSync(config.paths.distSampleComponents);
            distFolder = true;
        }
        catch(e) {
            distFolder = false;
            FoldersModel.clearFolders();
        }
       
		if(folderIndex < 0) {
            // Add folder for tracking
            FoldersModel.addFolder(currentFolderName, '');
        }
       
        var files = [];
        files = fs.readdirSync(currentFolderName);
        
        for(var x=0; x < files.length; x++) {
            
            var currentFile = files[x];
            var fileExists = FoldersModel.getFileIndex(
                FoldersModel.componentFolders,
                currentFolderName, 
                currentFile
            );
            
            if(fileExists < 0) {
                FoldersModel.addFile(
                    currentFolderName,
                    currentFile,
                    utilities.getFileModifiedTime(currentFolderName + '/' + files[x])
                );
            }
        }
        
        if(i == folderList.length - 1) {
            return;
        }
        
    }
     
     // console.log(FoldersModel.componentFolders);
});

gulp.task('component-samples-add-js', ['build-component-data'], plugins.folders(config.paths.componentsPath, function (folder) {

    return gulp.src(config.paths.componentsPath + '/' + folder + '/*.js')
            .on('error', errorHandling.onErrorInPipe)
      .pipe(plugins.foreach(function(stream){
          return stream
            .pipe(plugins.tap(function(file) {
                var filename = file.path.replace(/^.*[\\\/]/, '');
                storedFiles[folder]["files"].push('<script type="text/javascript" src="' + filename+ '"></script>' + "\r\b");
            }))
            .on('error', errorHandling.onErrorInPipe);
      }))
      .on('error', errorHandling.onErrorInPipe);
}));

//
// Sample Index Page Build
// ----------------------------------------------------------------------------

gulp.task('build-components-page', ['clean-samples', 'build-component-data', 'build-sample-data'], function() {
    return gulp.src(config.paths.templatePath + '/'+ 'samples-index.html')
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.data(function () {
        return { "components": buildLinkContainer(componentLinks.sort().join('')), "samples" :  buildLinkContainer(samplesLinks)};
    }))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.template())
        .on('error', errorHandling.onErrorInPipe)
    .pipe(plugins.rename('index.html'))
        .on('error', errorHandling.onErrorInPipe)
    .pipe(gulp.dest(config.paths.distSamples))
        .on('error', errorHandling.onErrorInPipe);
});

//
// Rolled up Build tasks
// ----------------------------------------------------------------------------

//Build Fabric Component Samples
gulp.task('build-component-samples', ['clean-component-samples', 'copy-component-samples', 'component-samples-less', 'build-component-data', 'component-samples-template']);

//
// Fabric Messages
// ----------------------------------------------------------------------------

gulp.task('component-samples-finished', ['build-component-samples'], function () {
    console.log(plugins.generateSuccess(' Component Samples build was successful! Yay!', true));
});

gulp.task('component-samples-updated', ['build-component-samples'], function () {
    console.log(plugins.generateSuccess(' Components Samples updated successfully! Yay!'));
});

//
// Watch Tasks
// ----------------------------------------------------------------------------

// Watches all src fabric components but, builds the samples only
gulp.task('watch:component-samples', ['build-component-samples', 'build-components-page', 'fabric-server',  'fabric-all-server'], function () {
    return gulp.watch(config.paths.componentsPath + '/**/*', plugins.batch(function (events, done) {
        plugins.runSequence('build-component-samples', done);
    }));
});