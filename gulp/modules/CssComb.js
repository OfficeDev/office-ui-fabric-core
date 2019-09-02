// This file serves to replace the gulp-csscomb dependency since the child csscomb dependency was out of date and exposing security vulnerabilities.
// It is a copy of the gulp-csscomb code but with the child csscomb dependency updated.

var Comb = require('csscomb');
var Plugins = require('./Plugins');
var through = require('through2');
var path = require('path');
var fs = require('fs');

// Constants
var PLUGIN_NAME = 'csscomb';
var SUPPORTED_EXTENSIONS = ['.css', '.sass', '.scss', '.less'];

function csscomb() {

  // Create a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {

    if (file.isNull()) {
    //   Do nothing
    } else if (file.isStream()) {
      this.emit('error', new Plugins.pluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    } else if (file.isBuffer() && SUPPORTED_EXTENSIONS.indexOf(path.extname(file.path)) !== -1) {

      var that = this;
      var configPath = Comb.getCustomConfigPath(path.join(path.dirname(file.path), '.csscomb.json'));
      var config = Comb.getCustomConfig(configPath);

      if (configPath && !fs.existsSync(configPath)) {
        this.emit('error', new Plugins.pluginError(PLUGIN_NAME, 'Configuration file not found: ' + Plugins.colors.magenta(configPath)));
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
          that.emit('error', new Plugins.pluginError(PLUGIN_NAME, file.path + '\n' + err));
      })
    }
    this.push(file);
    return cb();
  });
  return stream;
}

module.exports = csscomb;