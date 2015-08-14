'use strict';
// This is the base logging library for the build
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var plumber = require('gulp-plumber');
var _ = require('lodash');

if (!global.start) {
    global.start = process.hrtime();
}

var c_logFlushInterval = 1000; // 1 sec

global.warnings = [];
global.errors = [];
global.testsRun = 0;
global.testsPassed = 0;
global.taskRun = 0;
global.taskErrors = 0;
global.coverageResults = 0;
global.coveragePass = 0;
global.coverageTotal = 0;
global.wroteSummary = false;

function formatError(e) {
    if (!e.err) {
        return e.message + '\r\n' + e.stack;
    }

    // PluginError
    if (typeof e.err.showStack === 'boolean') {
        return e.err.toString() + (e.err.stack ? '\r\n' + e.err.stack : '');
    }

    // normal error
    if (e.err.stack) {
        return e.err.stack;
    }

    // unknown (string, number, etc.)
    if (typeof(Error) === 'undefined') {
        return e.message + '\r\n' + e.stack; 
    } else {
        return new Error(String(e.err)).stack;
    }
}

function plumberOnError(err) {
    log.writeError(err);

    this.emit('end');
};

function log() {

    var output = '';

    gutil.log.apply(this, arguments);
}

function writeSummary(config) {
    if (!global.wroteSummary) {
        global.wroteSummary = true;

        if (global.devEnvironmentConfig &&
            (global.devEnvironmentConfig.shouldSkipOptimizer || (global.devEnvironmentConfig.excludeFromMergePackages && global.devEnvironmentConfig.excludeFromMergePackages.length))) {
            log('Dev environment config: ' + gutil.colors.yellow(JSON.stringify(global.devEnvironmentConfig, null, 4)));
        }

        if (global.devProjectList && global.devProjectList.length) {
            log('Watching projects', gutil.colors.green(_.flatten(global.devProjectList, 'name')));
        }

        if (config.useLocalNodeServer) {
            log('Local Node server is', gutil.colors.green('enabled'));
            log('Dev build copy', gutil.colors.yellow('disabled'), 'because Local Node server is enabled');
        }
        else {
            log('Local Node server is disabled set the', gutil.colors.yellow('UseLocalNodeServer'), 'environment variable to a truthy value to enable it');

            if (config.devBuild) {
                log('Dev build copied to:', gutil.colors.green(process.env.DEVSCRIPTS_FOLDERSMACHINENAME));
            }
            else {
                log('Dev build disabled set the', gutil.colors.yellow('DEVSCRIPTS_FOLDERSMACHINENAME'), 'environment variable to your build machine to enable it');
            }
        }

        log('Create tasks duration:', gutil.colors.yellow(prettyTime(global.taskCreationTime)));
        log('Total duration:', gutil.colors.yellow(prettyTime(process.hrtime(log.getStart()))));
        log('Tasks run:', gutil.colors.yellow(global.taskRun));

        if (log.getTestsRun() > 0) {
            log('Tests results -', 'Passed:', gutil.colors.green(log.getTestsPassed()), 'Failed:', gutil.colors.red(log.getTestsRun() - log.getTestsPassed()));
        }

        if (global.coverageResults > 0) {
            log('Coverage results -', 'Passed:', gutil.colors.green(global.coveragePass), 'Failed:', gutil.colors.red(global.coverageResults - global.coveragePass), 'Avg. Cov.:', gutil.colors.yellow(Math.floor(global.coverageTotal / global.coverageResults) + '%'));
        }

        if (log.getWarnings().length) {
            log('Tasks warnings:', gutil.colors.red(log.getWarnings().length + '\r\n' + log.getWarnings().join('\r\n')));
        }

        if (global.taskErrors > 0 || log.getErrors().length) {
            log('Tasks errors:', gutil.colors.red(global.taskErrors + log.getErrors().length + '\r\n' + log.getErrors().join('\r\n')));
        }
    }

    // flush the log
    log.flush();
}

function writeError(e) {
    log.writeError(e);
    global.taskErrors++;
}

function exitProcess(errorCode) {
    // Force everthing to be written to stdout
    // this gets around some bugs in nodejs on windows
    log.flush();

    if (!global.watchMode) {
        process.stdout.write('', function () {
            process.exit(errorCode);
        });
    }
}

log.reset = function () {
    global.start = process.hrtime();
    global.warnings = [];
    global.errors = [];
    global.testsRun = 0;
    global.coverageResults = 0;
    global.coveragePass = 0;
    global.coverageTotal = 0;
    global.testsPassed = 0;
    global.taskRun = 0;
    global.taskErrors = 0;
    global.wroteSummary = false;
};

log.testRun = function (passed) {
    global.testsRun++;

    if (passed) {
        global.testsPassed++;
    }
};

log.coverageData = function (coverage, threshold, filePath) {
    global.coverageResults++;

    if (coverage < threshold) {
        log.error('Coverage:', Math.floor(coverage) + '% (<' + threshold + '%) -', filePath);
    } else {
        global.coveragePass++;
    }

    global.coverageTotal += coverage;
};

log.plumber = function () {
    return plumber(plumberOnError);
};

log.warn = function () {

    var newArgs = ['WARNING -'];

    for (var x = 0; x < arguments.length; x++) {
        newArgs.push(arguments[x]);
    }

    global.warnings.push(newArgs.join(' '));
    log(gutil.colors.yellow.apply(null, newArgs));
};

log.writeError = function (e) {
    if (e.err) {
        var msg = formatError(e);
        var time = prettyTime(e.hrDuration);
        log.error(
          '\'' + gutil.colors.cyan(e.task) + '\'',
          gutil.colors.red('errored after'),
          gutil.colors.magenta(time)
        );
        log.error(msg);
    }
    else if (e.fileName) // This is probably a plugin error
    {
        log.error(
            e.message,
            '\r\n',
            e.plugin + ': \'' + gutil.colors.yellow(e.fileName) + '\':' + e.lineNumber,
            '\r\n',
            e.stack
        );
    }
    else {
        log.error(
            'Unknown',
            '\r\n',
            gutil.colors.red(e.message),
            '\r\n',
            e.stack);
    }
};

log.error = function () {

    var newArgs = ['Error -'];

    for (var x = 0; x < arguments.length; x++) {
        newArgs.push(arguments[x]);
    }

    global.errors.push(newArgs.join(' '));
    log(gutil.colors.red.apply(null, newArgs));

    // flush after each error
    log.flush();
};

log.getWarnings = function () {
    return global.warnings;
};

log.getErrors = function () {
    return global.errors;
};

log.getStart = function () {
    return global.start;
};

log.getTestsRun = function () {
    return global.testsRun;
};

log.getTestsPassed = function () {
    return global.testsPassed;
};

log.flush = function () {
};

log.setWatchMode = function () {
    global.watchMode = true;
};

log.getWatchMode = function () {
    return global.watchMode;
};

log.addGulpLogging = function (gulp, gulpErrorCallback, gulpStopCallback) {
    // This will add logging to the gulp execution

    gulpErrorCallback = gulpErrorCallback || function () { };
    gulpStopCallback = gulpStopCallback || function () { };
    var config = require('./config').config;

    process.on('uncaughtException',
         function (err) {
             writeError(err);
             writeSummary(config);
             exitProcess(1);
             gulp.stop();
             gulpErrorCallback(err);
         });

    gulp.on('start', function (err) {
        log('Starting Gulp');
    });

    gulp.on('stop', function (err) {
        writeSummary(config);

        // error if we have any errors or warnings
        if (global.taskErrors > 0 || log.getErrors().length || log.getWarnings().length) {
            exitProcess(1);
        }

        gulpStopCallback(err);
    });

    gulp.on('err', function (err) {
        writeError(err);
        writeSummary(config);
        exitProcess(1);
        gulpErrorCallback(err);
    });

    gulp.on('task_start', function (e) {
        if (global.fromRunGulp) {
            log('Starting', '\'' + gutil.colors.cyan(e.task) + '\'...');
        }

        global.taskRun++;
    });

    gulp.on('task_stop', function (e) {
        var time = prettyTime(e.hrDuration);

        if (global.fromRunGulp) {
            log(
              'Finished', '\'' + gutil.colors.cyan(e.task) + '\'',
              'after', gutil.colors.magenta(time)
            );
        }
    });

    gulp.on('task_err', function (err) {
        writeError(err);
        writeSummary(config);
        exitProcess(1);
    });

    gulp.on('task_not_found', function (err) {
        log(
          gutil.colors.red('Task \'' + err.task + '\' is not in your gulpfile')
        );
        log('Please check the documentation for proper gulpfile formatting');
        exitProcess(1);
    });
};

log.markTaskCreationTime = function () {
    global.taskCreationTime = process.hrtime(log.getStart());
};

log.writeSummary = function () {
    writeSummary(config);
}

module.exports = log;
