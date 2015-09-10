var SCREEN_WIDTH = $(window).width();
var WIDTH_BREAKPOINT = 992;

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

var getStringTags = function(tagsArr) {
  var tags = "";
  if(tagsArr.length > 0) {
    tags = tagsArr[0];
    for(var i = 1; i < tagsArr.length; i++) {
      tags += "-" + tagsArr[i];
    }
  }
  return tags;
}

var shareFB = function(e) {
  FB.ui({
    method: 'share',
    href: window.location.href,
  }, function(response){});
  e.preventDefault();
}
