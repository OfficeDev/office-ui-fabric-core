var gutil = require('gulp-util');
var through = require('through2');
var tidy = require("tidy-html5").tidy_html5;

const PLUGIN_NAME = 'GulpVerifyHTML';

var VerifyHTML = function(options) {
    
    return through.obj(function (fileChunk, enc, cb) {
        if (!options) {
            options = {};
        }

        if (fileChunk.isNull()) {
            this.push(fileChunk);
            return cb();
        }

        if (fileChunk.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME + ' Error', 'Streaming not supported'));
            return cb();
        }

        var result = tidy(fileChunk.contents, options);
        
        fileChunk.contents = new Buffer(String(result));
        this.push(fileChunk);
        return cb();
        
        
        // function (error, html) {
        //     if (error) {
        //         this.emit('error', new gutil.PluginError('gulp-VerifyHTMLy', error));
        //     }

        //     fileChunk.contents = new Buffer(String(html));

        //     this.push(fileChunk);

        //     return cb();
        // }.bind(this)
        
    });
};

module.exports = VerifyHTML;