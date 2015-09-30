var HOSTELSTODISPLAY = 10;

var Hostels = React.createClass({displayName: "Hostels",
  mixins: [AutoCompleteContainerMixin],
  getInitialState: function() {
    return {location: city, query: '', tags: this.getArrayTags(getQueryValue("tags")), results: [], searchId: -1, dateFrom: getQueryValue("date-from"), dateTo: getQueryValue("date-to")};
  },
  componentWillMount: function() {
    this.getResults(this.state.location, this.state.tags, this.state.dateFrom, this.state.dateTo);
  },
  hostelsUpdateDates: function(dateFrom, dateTo) {
    this.updateDates(dateTo, dateFrom);
    this.getResults(this.state.location, this.state.tags, dateFrom, dateTo); 
  },
  hostelsAddTag: function(value) {
    this.getResults(this.state.location, this.addTag(value), this.state.dateFrom, this.state.dateTo);
  },
  hostelsRemoveTag: function() {
    this.getResults(this.state.location, this.removeTag(), this.state.dateFrom, this.state.dateTo);
  },
  hostelsRemoveSpecificTag: function(i) {
    this.getResults(this.state.location, this.removeSpecificTag(i), this.state.dateFrom, this.state.dateTo);
  },
  getResults: function(location, tags, dateFrom, dateTo) {
    this.setState({searchId: -1});
    var route;
    location = location.replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
    if (tags.length == 0)
      route = jsRoutes.controllers.SearchController.displayAll(location, dateFrom, dateTo);
    else
      route = jsRoutes.controllers.SearchController.classify(location, getStringTags(tags), dateFrom, dateTo);
    $.ajax({
      url: route.absoluteURL(),
      dataType: 'json',
      type: route.type,
      success: function(data) {
        this.setState({results: data.classifiedHostels, searchId: data.searchID});
        this.preloadPhotos(data.classifiedHostels);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(route.absoluteURL(), status, err.toString());
      }.bind(this)
    });
  },
  getArrayTags: function(tagsString) {
    var tags = [];
    var split = tagsString.split("-");
    for(var i in split) {
      if(split[i] != '') {
        tags.push(split[i]);
      }
    }
    return tags;
  },
  preloadPhotos: function(hostels) {
    var photos = $.map(hostels, function(hostel, i) {
      if(hostel.images.length > 0)
        return hostel.images[0];
      else
        return "";
    });
    preloadPhotos(photos);
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(SearchHeader, {location: this.state.location, query: this.state.query, tags: this.state.tags, updateLocationValue: this.updateLocationValue, updateQueryValue: this.updateQueryValue, addTag: this.hostelsAddTag, removeTag: this.hostelsRemoveTag, removeSpecificTag: this.hostelsRemoveSpecificTag, getResults: this.getResults, dateFrom: this.state.dateFrom, dateTo: this.state.dateTo, updateDates: this.hostelsUpdateDates}), 
        React.createElement(Content, {results: this.state.results, searchId: this.state.searchId, location: this.state.location, tags: this.state.tags, alsoTags: this.state.alsoTags, addTag: this.hostelsAddTag})
      )
    );
  }
});

var SearchHeader = React.createClass({displayName: "SearchHeader",
  mixins: [DatesMixin],
  updateDates: function(dateFrom, dateTo) {
    this.props.updateDates(dateFrom, dateTo);
  },
  render: function() {
    return (
      React.createElement("div", {className: "container-fluid header"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-8 location-col"}, 
            React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Location")), 
            React.createElement(AutoCompleteInput, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations=", value: this.props.location, updateValue: this.props.updateLocationValue, getResults: this.props.getResults, tags: this.props.tags})
          ), 
          React.createElement("div", {className: "col-md-4"}, 
            React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "col-xs-6 date-col-left"}, 
                React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Check in")), 
                 React.createElement("input", {type: "text", ref: "dateFrom", placeholder: "Check in", className: "triptailor-input date-input-left", readOnly: true})
               ), 
               React.createElement("div", {className: "col-xs-6 date-col-right"}, 
                React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Check out")), 
                 React.createElement("input", {type: "text", ref: "dateTo", placeholder: "Check out", className: "triptailor-input date-input-right", readOnly: true})
               )
            )
          )
        ), 
        React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Tags")), 
        React.createElement(AutoCompleteTags, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags=", value: this.props.query, updateValue: this.props.updateQueryValue, tags: this.props.tags, addTag: this.props.addTag, removeTag: this.props.removeTag, removeSpecificTag: this.props.removeSpecificTag})
      )
    );
  }
});

var AutoCompleteInput = React.createClass({displayName: "AutoCompleteInput",
  mixins: [AutoCompleteMixin, AutoCompleteInputMixin],
  hostelsElementClick: function(elementValue) {
    this.elementClick(elementValue);
    this.props.getResults(elementValue, this.props.tags, dateFrom, dateTo);
  },
  hostelsHandleKeyUp: function(e) {
    this.handleKeyUp(e);
    if(e.keyCode == 13 && this.state.selectedItem >= 0)
      this.props.getResults(this.state.hints[this.state.selectedItem], this.props.tags, dateFrom, dateTo);
  },
  hostelsHandleKeyDown: function(e) {
    this.handleKeyDown(e);
    if(e.keyCode == 9 && this.state.selectedItem >= 0) {
      e.preventDefault();
      this.props.getResults(this.state.hints[this.state.selectedItem], this.props.tags, dateFrom, dateTo);
    }
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("input", {ref: "query", type: "text", className: "triptailor-input location-input", placeholder: "Pick a city", autoComplete: "off", value: this.props.value, onChange: this.handleValueChanged, onKeyUp: this.hostelsHandleKeyUp, onBlur: this.handleBlur, onKeyDown: this.hostelsHandleKeyDown}), 
        this.state.hints.length > 0 ? React.createElement(TripTailorAutoCompleteResults, {hints: this.state.hints, selectedItem: this.state.selectedItem, elementClick: this.hostelsElementClick, elementHover: this.updateSelectedItem}) : ''
      )
    );
  }
});

var AutoCompleteTags = React.createClass({displayName: "AutoCompleteTags",
  mixins: [AutoCompleteTagsMixin],
  render: function() {
    var tags = $.map(this.props.tags, function(value, i) {
      return (
        React.createElement(TripTailorInputTag, {ref: "tag-" + i, key: i, index: i, value: value, removeSpecificTag: this.props.removeSpecificTag})
      );
    }.bind(this));

    return (
      React.createElement("div", {ref: "tags-container", className: "autocomplete-tags-container"}, 
        React.createElement("div", {className: "tag-search-container"}, 
          tags, 
          React.createElement("div", {className: "tag-search-input"}, 
            React.createElement("input", {ref: "query", type: "text", className: "triptailor-input input-tags", placeholder: this.props.tags.length == 0 ? "Write some tags" : "", autoComplete: "off", value: this.props.value, onChange: this.handleValueChanged, onKeyUp: this.handleKeyUp, onBlur: this.handleBlur, onKeyDown: this.handleKeyDown})
          )
        ), 
        this.state.hints.length > 0 ? React.createElement(TripTailorAutoCompleteResults, {hints: this.state.hints, selectedItem: this.state.selectedItem, elementClick: this.elementClick, elementHover: this.updateSelectedItem}) : ''
      )
    );
  }
});



var Content = React.createClass({displayName: "Content",
  render: function() {
    return (
      React.createElement("div", {className: "container-fluid content"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-3"}, 
            React.createElement(Filters, React.__spread({},  this.props))
          ), 
          React.createElement("div", {className: "col-md-9"}, 
            this.props.searchId >= 0 ? React.createElement(NumberResults, {results: this.props.results.length}) : React.createElement("div", {className: "spinner"}, React.createElement("img", {src: "../assets/images/spinner.gif"})), 
            this.props.searchId >= 0 ? React.createElement(ResultsGrid, React.__spread({},  this.props)) : ""
          )
        )
      )
    );
  }
});

var NumberResults = React.createClass({displayName: "NumberResults",
  render: function() {
    return (
      React.createElement("p", {className: "results-number"}, "Matching results ", React.createElement("strong", null, this.props.results))
    );
  }
});

var ResultsGrid = React.createClass({displayName: "ResultsGrid",
  getInitialState: function() {
    return {displayedResults: HOSTELSTODISPLAY};
  },
  displayMoreResults: function() {
    this.setState({displayedResults: this.state.displayedResults + HOSTELSTODISPLAY});
  },
  render: function() {
    var results = [];
    for(var i = 0; i < this.props.results.length && i < this.state.displayedResults; i++) {
      if(this.props.results[i].url != null)
        results.push(React.createElement(Result, {key: i, result: this.props.results[i], moreTags: this.state.more, showMoreTags: this.showMoreTags, showLessTags: this.showLessTags, searchId: this.props.searchId, tags: this.props.tags}));
    };
    return (
      React.createElement("div", null, 
        results, 
        this.props.results.length > this.state.displayedResults ? React.createElement("button", {className: "more-results", onClick: this.displayMoreResults}, "Show more results") : ''
      )
    );
  }
});

var Result = React.createClass({displayName: "Result",
  handleClick: function() {
    var route = jsRoutes.controllers.StatsController.saveHostelClick();
    $.ajax({
      url: route.absoluteURL(),
      type: route.type,
      data: { hostelId: this.props.result.id, searchId: this.props.searchId }
    }).fail( function(xhr, ts, e) {
      console.error(route.absoluteURL(), ts, e.toString())
    })
  },
  render: function() {
    var route = jsRoutes.controllers.SearchController.detail(this.props.result.name, getStringTags(this.props.tags));
    var tags = [];
    for(var i = 0; i < this.props.result.tags.length; i++) {
      tags.push(React.createElement(Tag, {key: i, name: this.props.result.tags[i].name, type: this.props.result.tags[i].type}));
    }

    var description = "";
    if(this.props.result.description != null) {
      var ps = this.props.result.description.split("</p>");
      if(ps.length > 0)
        description += ps[0].replace(/\\u2019/g, "'") + "</p>";
      if(ps.length > 1)
        description += ps[1].replace(/\\u2019/g, "'") + "</p>";
    }
    return (
      React.createElement("div", {className: "result"}, 
        React.createElement("a", {href: route.absoluteURL(), className: "result-a", onClick: this.handleClick}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-xs-3"}, 
              React.createElement("div", {className: "result-photo", style: this.props.result.images.length > 0 ? {background: "url(" + this.props.result.images[0] + ") no-repeat center top", backgroundSize: "contain"} : {}})
            ), 
            React.createElement("div", {className: "col-xs-9"}, 
              React.createElement("div", {className: "result-name"}, 
                React.createElement("div", {className: "result-price"}, React.createElement("strong", null, this.props.result.price), " ", this.props.result.currency), 
                React.createElement("strong", null, this.props.result.name)
              ), 
              React.createElement("div", {className: "result-description", dangerouslySetInnerHTML: {__html: description}}), 
              React.createElement("div", {className: "result-tags"}, 
                React.createElement("p", null, React.createElement("strong", null, "Tags")), 
                tags
              )
            )
          )
        )
      )
    );
  }
});

var Tag = React.createClass({displayName: "Tag",
  render: function() {
    return (
      React.createElement("div", {className: this.props.type == 0 ? "tag tag-selected" : "tag tag-unselected"}, this.props.name)
    );
  }
});

var Filters = React.createClass({displayName: "Filters",
  render: function() {
    return(
      React.createElement("div", null, 
        React.createElement(AlsoTry, {location: this.props.location, tags: this.props.tags, alsoTags: this.props.alsoTags, addTag: this.props.addTag}), 
        React.createElement(TagsHint, null)
      )
    );
  }
});

var AlsoTry = React.createClass({displayName: "AlsoTry",
  getInitialState: function() {
    return {alsoTags: []};
  },
  componentWillMount: function() {
    this.getSuggestions();
  },
  removeSpecificAlsoTag: function(i) {
    this.setState({alsoTags: this.state.alsoTags.slice(0, i).concat(this.state.alsoTags.slice(i + 1, this.state.alsoTags.length))});
  },
  getSuggestions: function(location) {
    var route = jsRoutes.controllers.HintsController.tagSuggestions();
    $.ajax({
      url: route.absoluteURL() + "?location=" + this.props.location.replace(", ", ",") + (this.props.tags.length > 0 ? "&tags=" + getStringTags(this.props.tags) : ""),
      dataType: 'json',
      type: route.type,
      success: function(data) {
        this.setState({alsoTags: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(route.absoluteURL(), status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var tags = $.map(this.state.alsoTags, function(value, i) {
      return (
        React.createElement(AlsoTryTag, {key: i, index: i, name: value, add: this.props.addTag, remove: this.removeSpecificAlsoTag})
      );
    }.bind(this));

    return (
      React.createElement("div", {className: "filter"}, 
        tags.length > 0 ? React.createElement("p", {className: "filter-label"}, React.createElement("strong", null, "Also Try")) : React.createElement("p", {className: "filter-label"}, "Try adding more tags yourself."), 
        tags.length > 0 ? React.createElement("div", null, 
          tags
        ) : ""
      )
    );
  }
});

var TagsHint = React.createClass({displayName: "TagsHint",
  render: function() {
    return (
      React.createElement("div", {className: "tags-hint filter"}, 
        React.createElement("p", {className: "filter-label"}, React.createElement("i", {className: "fa fa-rocket fa-1x"}), React.createElement("strong", null, "Hint")), 
        React.createElement("div", null, "Tags are keywords that people mentioned a lot in a positive context.")
      )
    );
  }
});

var AlsoTryTag = React.createClass({displayName: "AlsoTryTag",
  handleClick: function() {
    this.props.add(this.props.name);
    this.props.remove(this.props.index);
  },
  render: function() {
    return (
      React.createElement("div", {className: "tag tag-unselected tag-also", onClick: this.handleClick}, this.props.name)
    );
  }
});

React.render(React.createElement(Hostels, null), document.getElementById("content"));
