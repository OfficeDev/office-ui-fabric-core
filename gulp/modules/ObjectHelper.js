var ObjectHelper = function() {
	
	this.findKey = function(sourceObj, id) {
		var index = -1;
		sourceObj.some(function(entry, i) {
			// console.log(entry);
			if (id in entry) {
				index = i;
				return true;
			}
		});
	}
	
	this.findIndexByKey = function(sourceArray, key) {
		
		for(var i = 0; i < sourceArray.length; i++) {
			if(sourceArray[i].hasOwnProperty(key)) {
				return i;
			}
		}
		
		return -1;
	}
	
}

module.exports = new ObjectHelper();