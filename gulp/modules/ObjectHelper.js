var ObjectHelper = function() {
	
	this.findKey = function(sourceObj, id) {
		return sourceObj.filter(function( obj ) {
			return +obj.id === +id;
		})[ 0 ];
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