/** Class for working adding banners to files */
var Config = require('./Config');
var Plugins = require('./Plugins');
var ErrorHandling = require('./ErrorHandling');

var BuildConfig = function() {
  this.srcPath = Config.paths.srcSass;
  this.processorPlugin = Plugins.sass;
  this.fileExtension = Config.sassExtension;
  this.template = 'component-manifest-template.scss';
  this.compileErrorHandler = ErrorHandling.SASSCompileErrors;
  this.processorName = "sass";
  this.nukeTasks = [];
  this.buildTasks = [];
};

module.exports = new BuildConfig();