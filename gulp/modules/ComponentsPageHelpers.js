var ComponentsPageHelpers = function() {
	this.sampleLinks = '';
	this.componentLinks = '';
	
	
	this.buildLinkContainer = function(links) {
    	return '<div class="LinkContainer">'+ links +'</div>';
	}
	
	this.buildLinkHtml = function (href, name) {
		var link = '<a href="' + href + '/" class="ms-Link ms-font-l ms-fontWeight-semilight ms-bgColor-neutralLighter--hover">' + name + '</a>';
		return link;
	}
}

module.exports = new ComponentsPageHelpers();