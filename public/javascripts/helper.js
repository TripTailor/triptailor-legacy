var adVariables = function() {
	var adVariable = getQueryVariable("gclid");
	if(adVariable.length > 0)
		return "?" + adVariable;
	adVariable = getQueryVariable("ad");
	if(adVariable.length > 0)
		return "?" + adVariable;
	return "";
}

var getQueryVariable = function(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[0];}
	}
	return "";
};

var getQueryValue = function(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return "";
};
