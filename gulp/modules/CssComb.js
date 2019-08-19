'use strict';

var Comb = require('csscomb');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');
var PluginError = gutil.PluginError;

// Constants
var PLUGIN_NAME = 'csscomb';
var SUPPORTED_EXTENSIONS = ['.css', '.sass', '.scss', '.less'];

function csscomb() {

  // Create a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {

    if (file.isNull()) {
    //   Do nothing
    } else if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    } else if (file.isBuffer() && SUPPORTED_EXTENSIONS.indexOf(path.extname(file.path)) !== -1) {

      var that = this;
      var configPath = Comb.getCustomConfigPath(path.join(path.dirname(file.path), '.csscomb.json'));
      var config = Comb.getCustomConfig(configPath);

      if (configPath && !fs.existsSync(configPath)) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Configuration file not found: ' + gutil.colors.magenta(configPath)));
        return cb();
      }

      var comb = new Comb(config);
      var syntax = file.path.split('.').pop();

      comb.processString(
          file.contents.toString('utf8'), {
          syntax: syntax,
          filename: file.path
      }).then(function(results) {
          file.contents = Buffer.from(results);
      }).catch(function(err) {
          that.emit('error', new PluginError(PLUGIN_NAME, file.path + '\n' + err));
      })
    }
    this.push(file);
    return cb();
  });
  return stream;
}

module.exports = csscomb;