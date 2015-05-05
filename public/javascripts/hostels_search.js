var saveHostelClick = function(searchId, hostelId) {
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

    // TODO: Refactor this to use javascript reverse route
	xmlhttp.open("POST", "http://localhost:8080/TripTailor/stats/hostel-click", true);
	xmlhttp.send("searchId=" + searchId + "&hostelId=" + hostelId);
};