// This file serves to replace the gulp-compile-handlebars dependency since the child gulp-util dependency was causing security vulnerabilities.
// It is a copy of the gulp-compile-handlebars code but with the gulp-util dependency removed.

var Plugins = require('./Plugins');
var Handlebars = require('handlebars');
var through = require('through2');
var extend = require('util')._extend;
var path = require('path');
var fs = require('fs');

function handlebars(data, opts) {

	var options = opts || {};
	var hb = handlebars.Handlebars;

	//Go through a partials object
	if(options.partials){
		for(var p in options.partials){
			hb.registerPartial(p, options.partials[p]);
		}
	}
	//Go through a helpers object
	if(options.helpers){
		for(var h in options.helpers){
			hb.registerHelper(h, options.helpers[h]);
		}
	}

	// Do not search for more than 10 nestings
	var maxDepth = 10;
	// Process only files with given extension names
	var allowedExtensions = ['hb', 'hbs', 'handlebars', 'html'];

	var isDir = function (filename) {
		var stats = fs.statSync(filename);
		return stats && stats.isDirectory();
	};

	var isHandlebars = function (filename) {
		return allowedExtensions.indexOf(filename.split('.').pop()) !== -1;
	};

	var partialName = function (filename, base) {
		var name = path.join(path.dirname(filename), path.basename(filename, path.extname(filename)));
		if (name.indexOf(base) === 0) {
			name = name.slice(base.length);
		}
		// Change the name of the partial to use / in the partial name, not \
		name = name.replace(/\\/g, '/');

		// Remove leading _ and / character
		var firstChar = name.charAt(0);
		if( firstChar === '_' || firstChar === '/'  ){
			name = name.substring(1);
		}
		
		return name;
	};

	var registerPartial = function (filename, base) {
		if (!isHandlebars(filename)) { return; }
		var name = partialName(filename, base);
		var template = fs.readFileSync(filename, 'utf8');

		hb.registerPartial(name, template);
	};

	var registerPartials = function (dir, base, depth) {
		if (depth > maxDepth) { return; }
		base = base || dir;
		fs.readdirSync(dir).forEach(function (basename) {
			var filename = path.join(dir, basename);
			if (isDir(filename)) {
				registerPartials(filename, base);
			} else {
				registerPartial(filename, base);
			}
		});
	};

	// Go through a partials directory array
	if(options.batch){
		// Allow single string
		if(typeof options.batch === 'string') options.batch = [options.batch];

		options.batch.forEach(function (dir) {
			dir = path.normalize(dir);
			registerPartials(dir, dir, 0);
		});
	}

	/**
	 * For handling unknown partials
	 * @method mockPartials
	 * @param  {string}     content Contents of handlebars file
	 */
	var mockPartials = function(content){
		var regex = /{{> (.*)}}/gim, match, partial;
		if(content.match(regex)){
			while((match = regex.exec(content)) !== null){
				partial = match[1];
				//Only register an empty partial if the partial has not already been registered
				if(!hb.partials.hasOwnProperty(partial)){
					hb.registerPartial(partial, '');
				}
			}
		}
	};


	return through.obj(function (file, enc, cb) {
		var _data = extend({}, data);

		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new Plugins.pluginError('compile-handlebars', 'Streaming not supported'));
			return cb();
		}

		try {
			var fileContents = file.contents.toString();
			if(options.ignorePartials){
				mockPartials(fileContents);
			}

			// Enable gulp-data usage, Extend default data with data from file.data
			if(file.data){
				_data = extend(_data, file.data);
			}
			var template = hb.compile(fileContents, options.compile);
			file.contents = Buffer.from(template(_data));
		} catch (err) {
			this.emit('error', new Plugins.pluginError('compile-handlebars', err));
		}

		this.push(file);
		cb();
	});
}

handlebars.reset = function(){
	// Expose the Handlebars object
	handlebars.Handlebars = Handlebars.create();
}

handlebars.reset();

module.exports = handlebars;