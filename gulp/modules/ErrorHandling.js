var path = require('path');
var ErrorHandling = function() {
	this.onErrorInPipe = function(error) {
		 console.log(error);
	}
    this.onHTMLError = function(error) {
        console.log(error);
        console.log("Html error occured");
    }
}

module.exports = new ErrorHandling();