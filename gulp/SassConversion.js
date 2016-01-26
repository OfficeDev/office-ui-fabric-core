var gulp = require('gulp');
var fs = require('fs');
var Config = require('./modules/Config');

// Fabric Helper Modules
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Plugins = require('./modules/Plugins');
var Utilities = require('./modules/Utilities');
var ComponentHelper = require('./modules/ComponentHelper');

var folderList = Utilities.getFolders(Config.paths.componentsPath);

gulp.task('SassConversion', function () {
   return folderList.map(function(componentName) {
        return gulp.src(Config.paths.componentsPath + '/' + componentName + '/*.less')
            .pipe(Plugins.debug({
                title: "Building Sample Component " + componentName
            }))
            .pipe(Plugins.lessToScss())
            .pipe(gulp.dest(Config.paths.distComponents + '/' + componentName));
   });
});
gulp.task('SassConversion-template', function () {
        return gulp.src(Config.paths.templatePath + '/*.less')
            .pipe(Plugins.debug({
                title: "Building Sample Component "
            }))
            .pipe(Plugins.lessToScss())
            .pipe(gulp.dest(Config.paths.templatePath + '/'));
});

gulp.task('SassConversion-makeIconMixins', function () {
    var iconFile = fs.readFileSync(Config.paths.srcSass + '/Fabric.Icons.Output.scss', 'utf8');
    var splitFile = iconFile.split("\n");
    var startGenerating = false;
    var newFile = '';
    for(var i = 0; i < splitFile.length; i++) {
        var line = splitFile[i];
        //console.log(line);
        if(line.indexOf('//*-- Start') > -1) {
            startGenerating = true;
        } else if(line.indexOf('//*-- end') > -1) {
            startGenerating = false;
        } else if(startGenerating == true) {
            var firstSplit = line.split('--');
            var firstSplitPartOne = firstSplit[1];
            var secondSplit = firstSplitPartOne.split(':');
            var iconName = secondSplit[0];
            newFile += ".ms-Icon--" + iconName + ":before { @include ms-Icon--" + iconName + "; } \r\n"
        }
    }
    fs.writeFile('MixinGeneration.txt', newFile);
});


gulp.task('SassConversion-makeNewGridOutput', function () {
    var iconFile = fs.readFileSync(Config.paths.srcSass + '/_Fabric.Responsive.Utilities.Variables.scss', 'utf8');
    var splitFile = iconFile.split("\n");
    var newFile = '';
    for(var i = 0; i < splitFile.length; i++) {
        var line = splitFile[i];
        if(line.indexOf('@mixin') > -1) {
            var firstSplit = line.split(' ');
            var name = firstSplit[1];
            newFile += "." + name + " {\r\n" + "  @include " + name + ";\r\n}\r\n";  
        }
    }
    fs.writeFile('MixinGenerationGrid.txt', newFile);
});
