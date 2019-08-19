var
	es = require('event-stream'),
	Lintspaces = require('lintspaces'),
	PluginError = require('plugin-error'),
	path = require('path'),
	appRoot = require('app-root-path'),
	colors = require('colors/safe'),
	logSymbols = require('log-symbols')
;

module.exports = function(options) {
    var lintspaces = new Lintspaces(options || {});

	return es.through(function(file) {
		if (file.isNull()) {
			return this.emit('data', file);
        }
        
		lintspaces.validate(file.path);
		file.lintspaces = lintspaces.getInvalidLines(file.path);

		// HACK: Clean-up the cache for re-validation
        delete lintspaces._invalid[file.path];

		return this.emit('data', file);
	});
};

module.exports.reporter = function(options) {
	var opts = {
		breakOnWarning: false,
		prefixLogs: false
	};
	for (var attr in options) { opts[attr] = options[attr]; }
	var totalWarningCount = 0;
	var logPrefix = opts.prefixLogs ? colors.cyan('[lintspaces]\t') : '';

	function reportFile (filepath, data) {
		var lines = [];
		var warningLines = Object.keys(data);
		var warningCount = Object.keys(data).length;

		// Report Filename
		lines.push(colors.white.bold.underline(path.relative(appRoot.path, filepath)));
		// Loop through and report warnings
		warningLines.forEach(function (warningLine) {
			var line = colors.grey('  line ' + data[warningLine][0].line) + '\t\t  ' + colors.cyan(data[warningLine][0].message);
			lines.push(line);
		});
		lines.push('');
		lines.push('  ' + logSymbols.info + ' ' + colors.blue(warningCount + ' whitespace warning' + (warningCount !== 1 ? 's' : '')));
		lines = lines.map(function(line) { return logPrefix + line; });

		return lines.join('\n') + '\n';
	}

	// Add report summary
	function reportSummary () {
		if (totalWarningCount !== 0) {
			console.log(logPrefix + logSymbols.info + colors.blue(' ' + totalWarningCount + ' whitespace warning' + (totalWarningCount !== 1 ? 's' : '') + '\n'));
		}
	}

	return es.through(function (file) {
		if (file.isNull()) {
			return this.emit('data', file);
		}

		// Report file specific stuff only when there are warnings
		if (file.lintspaces && Object.keys(file.lintspaces).length) {
			totalWarningCount += Object.keys(file.lintspaces).length;
			console.log(reportFile(file.path, file.lintspaces));
		}
		return this.emit('data', file);
	})
	.on('end', function () {
		reportSummary();
		if (totalWarningCount && opts.breakOnWarning) {
			this.emit('error', new PluginError('lintspaces', 'Linter warnings occurred!'));
		}
	});
};