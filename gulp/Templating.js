var gulp = require('gulp');
var fs = require('fs');
var Utilities = require('./modules/Utilities');
var Banners = require('./modules/Banners');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var ConsoleHelper = require('./modules/ConsoleHelper');
var ErrorHandling = require('./modules/ErrorHandling');
var Template = require('./modules/Template');
var Plugins = require('./modules/Plugins');
var ComponentHelper = require('./modules/ComponentHelper');
var folderList = Utilities.getFolders(Config.paths.componentsPath);

gulp.task('ComponentSamples-build', ['ComponentSamples-handlebars'], function(cb) {
  
  var _template = new Template(folderList, Config.paths.distJS, Config.paths.componentsPath, function() {
    
    cb();
  });
  
   //var streams = [];
  
  //  for(var i=0; i < folderList.length; i++) {
  //      var folderName = folderList[i];
  //      var srcFolderName = Config.paths.componentsPath + '/' + folderName;
  //      var distFolderName = Config.paths.distSampleComponents + '/' + folderName;
  //      var hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.html');
  //      hasFileChanged = Utilities.hasFileChangedInFolder(srcFolderName, distFolderName, '.json');
       
  //      if (hasFileChanged) {
          
  //      }
  //  }
  
  
});