// TODO: Refactor this to use javascript reverse route
var HOSTELSURL = "http://localhost:9000/hostels/";
//var HOSTELSURL = "http://localhost:8080/TripTailor/hostels/";
var SEARCHURL = HOSTELSURL + "search/";
var AUTOCOMPLETEQUERYURL = HOSTELSURL + "hints/hostels/";
var AUTOCOMPLETECITYURL = HOSTELSURL + "hints/locations/";
var TIMEOUT = 300;
var xmlhttp;

// KEY CODES https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
var TAB_KEY    = 9;
var ENTER_KEY  = 13;
var ESCAPE_KEY = 27;



window.addEventListener("load", function(load_e) {
	var query = document.getElementById("query");
	var city = document.getElementById("city");
	var autocompleteQuery = document.getElementById("autocompleteQuery");
	var autocompleteCity = document.getElementById("autocompleteCity");

	document.addEventListener("click", function(e) {
		autocompleteQuery.style.removeProperty("display");
		autocompleteCity.style.removeProperty("display");
	});

	document.addEventListener("keydown", function(e) {
		if(e.keyCode == ESCAPE_KEY || e.keyCode == TAB_KEY) {
			autocompleteQuery.style.removeProperty("display");
			autocompleteCity.style.removeProperty("display");
		}
	});

	query.addEventListener("keyup", function(e) {
		if(query.value == "") {
			autocompleteQuery.style.removeProperty("display");
		}
		else if(e.keyCode == ENTER_KEY) {
			document.getElementById("submit").click();
		}
		else if(e.keyCode != ESCAPE_KEY) {
		    console.log(e.keyCode);
			query.style.removeProperty("border");
			var val = query.value;
			setTimeout(function() {
				if(val != "" && val == query.value) {
					ajax(AUTOCOMPLETEQUERYURL + val.trim().replace(/ /g, "-"), function() {
						if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
							while(autocompleteQuery.firstChild)
								autocompleteQuery.removeChild(autocompleteQuery.firstChild);

							var json    = JSON.parse(xmlhttp.responseText);
							var hostels = json.hostels;
							var tags    = json.tags;

							if(query === document.activeElement && (hostels.length > 0 || tags.length > 0))
								autocompleteQuery.style.display =  "block";
							else
								autocompleteQuery.style.removeProperty("display");

							if(hostels.length > 0) {
								var div = document.createElement("div");
								div.id = "hostels";

								var pTitle = document.createElement("p");
								pTitle.innerHTML = "Hostels";
								pTitle.className = "title";
								div.appendChild(pTitle);
								for(var i = 0; i < hostels.length; i++) {
									var p = document.createElement("p");
									p.innerHTML = hostels[i];
									p.className = "autocomplete-element";
									p.addEventListener("click", function() {
										query.value = arguments[0];
									}.bind(this, hostels[i]));
									div.appendChild(p);
								}
								autocompleteQuery.appendChild(div);
							}

							if(tags.length > 0) {
								var div = document.createElement("div");
								div.id = "tags";

								var pTitle = document.createElement("p");
								pTitle.innerHTML = "Tags";
								pTitle.className = "title";
								div.appendChild(pTitle);
								for(var i = 0; i < tags.length; i++) {
									var p = document.createElement("p");
									p.innerHTML = tags[i];
									p.className = "autocomplete-element";
									p.addEventListener("click", function() {
										var queries = query.value.split(/[ ,-]/g);
										query.value = "";
										for(var i = 0; i < queries.length - 1; i++)
											query.value += queries[i] + " ";
										query.value += arguments[0];
									}.bind(this, tags[i]));
									div.appendChild(p);
								}
								autocompleteQuery.appendChild(div);
							}
						}
					});
				}
			}, TIMEOUT);
		}
	});

	city.addEventListener("keyup", function(e) {
		if(city.value == "") {
			autocompleteCity.style.removeProperty("display");
		}
		else if(e.keyCode == ENTER_KEY) {
			document.getElementById("submit").click();
		}
		else if(e.keyCode != ESCAPE_KEY) {
			city.style.removeProperty("border");
			var val = city.value;
			setTimeout(function() {
				if(val != "" && val == city.value) {
					ajax(AUTOCOMPLETECITYURL + val.trim().replace(/ /g, "-"), function() {
						if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
							while(autocompleteCity.firstChild)
							autocompleteCity.removeChild(autocompleteCity.firstChild);

							var locations = JSON.parse(xmlhttp.responseText);

							if(city === document.activeElement && locations.length > 0)
								autocompleteCity.style.display =  "block";
							else
								autocompleteCity.style.removeProperty("display");

							if(locations.length > 0) {
								var div = document.createElement("div");

								var pTitle = document.createElement("p");
								pTitle.innerHTML = "Places";
								pTitle.className = "title";
								div.appendChild(pTitle);
								for(var i = 0; i < locations.length; i++) {
									var p = document.createElement("p");
									p.innerHTML = locations[i];
									p.className = "autocomplete-element";
									p.addEventListener("click", function() {
										city.value = arguments[0];
									}.bind(this, locations[i]));
									div.appendChild(p);
								}
								autocompleteCity.appendChild(div);
							}
						}
					});
				}
			}, TIMEOUT);
		}
	});
});

var ajax = function(url, response) {
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = response;
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};

var prepareForm = function() {
	var query = document.getElementById("query");
	var city = document.getElementById("city");
	var cityVal = city.value.trim();
	var queryVal = query.value.trim();
	console.log(cityVal);
	if(cityVal == "")
		city.style.border = "2px solid #5F2B25";
	if(cityVal == "")
		return false;
	var url = SEARCHURL + cityVal.replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
	if(queryVal != "")
		url += "/" + queryVal.replace(/%/g,"").replace(/-/g, "%21").replace(/[\/ ]/g, "-");
	document.getElementById("submit").href = url + adVariables();
	return true;
};

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
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[0];}
	}
	return "";
};