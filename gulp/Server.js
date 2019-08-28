var gulp = require('gulp');
var BuildConfig = require('./modules/BuildConfig');
var Server = require('./modules/Server');
var running = false;

function server(done) {
  Server.start();
  done();
}

exports.server = server;
