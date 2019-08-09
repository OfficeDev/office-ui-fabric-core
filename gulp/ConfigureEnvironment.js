var gulp = require('gulp');
var Config = require('./modules/Config');
var BuildConfig = require('./modules/BuildConfig');
var Plugins = require('./modules/Plugins');
var ErrorHandling = require('./modules/ErrorHandling');

function setDebugMode(done) {
  Config.debugMode = true;
  done();
}
exports.setDebugMode = setDebugMode;
