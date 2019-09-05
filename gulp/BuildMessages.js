var ConsoleHelper = require('./modules/ConsoleHelper');
var Config = require('./modules/Config');

//
// Fabric Messages
// ----------------------------------------------------------------------------

// var allFinishedtasks = watchTasks.concat(['Errors-checkAllErrors']);
function buildMessagesFinished(done) {
    console.log(ConsoleHelper.generateSuccess('Fabric build was successful, now sing and dance!', true));
    done();
};

function buildMessagesServer(done) {
    console.log(ConsoleHelper.generateSuccess('Fabric built successfully! ' + "\r\n" + 'Fabric documentation located at ' + Config.projectURL + ':' + Config.port, false));
    done();
};

function buildMessagesUpdated(done) {
    console.log(ConsoleHelper.generateSuccess('Fabric updated, yay!', false));
    done();
};

exports.buildMessagesServer = buildMessagesServer;
exports.buildMessagesUpdated = buildMessagesUpdated;
exports.buildMessagesFinished = buildMessagesFinished;