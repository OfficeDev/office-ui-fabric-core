var path = require('path');
var ErrorHandling = function() {
	this.onErrorInPipe = function(error) {
		 console.log(error);
	}
}

module.exports = new ErrorHandling();