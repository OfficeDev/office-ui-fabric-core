/** Class for working adding banners to files */
var BuildConfig = function() {
  this.srcPath;
  this.processorPlugin;
  this.fileExtension;
  this.template;
  this.compileErrorHandler;
  this.name;
};

module.exports = new BuildConfig();