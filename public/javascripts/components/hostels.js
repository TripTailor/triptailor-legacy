var HOSTELSTODISPLAY = 16;

var Hostels = React.createClass({displayName: "Hostels",
	mixins: [AutoCompleteContainerMixin],
	getInitialState: function() {
		return {location: city, query: '', tags: this.getArrayTags(getQueryValue("tags")), results: [], displayedResults: HOSTELSTODISPLAY, alsoTags: [], searchId: -1};
	},
	componentWillMount: function() {
		this.getResults(this.state.location, this.state.tags);
		this.getSuggestions(this.state.location);
	},
	hostelsAddTag: function(value) {
		this.getResults(this.state.location, this.addTag(value));
	},
	hostelsRemoveTag: function() {
		this.getResults(this.state.location, this.removeTag());
	},
	hostelsRemoveSpecificTag: function(i) {
		this.getResults(this.state.location, this.removeSpecificTag(i));
	},
	removeSpecificAlsoTag: function(i) {
		this.setState({alsoTags: this.state.alsoTags.slice(0, i).concat(this.state.alsoTags.slice(i + 1, this.state.alsoTags.length))});
	},
	displayMoreResults: function() {
		this.setState({displayedResults: this.state.displayedResults + HOSTELSTODISPLAY});
	},
	getResults: function(location, tags) {
		var route;
		location = location.replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
		if (tags.length == 0)
			route = jsRoutes.controllers.SearchController.displayAll(location);
		else
			route = jsRoutes.controllers.SearchController.classify(location, getStringTags(tags));
		$.ajax({
			url: route.absoluteURL(),
			dataType: 'json',
			type: route.type,
			success: function(data) {
				this.setState({results: data.classifiedHostels, searchId: data.searchID});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(route.absoluteURL(), status, err.toString());
			}.bind(this)
		});
	},
	getSuggestions: function(location) {
		var route = jsRoutes.controllers.HintsController.tagSuggestions();
		$.ajax({
			url: route.absoluteURL() + "?location=" + location.replace(", ", ",") + (this.state.tags.length > 0 ? "&tags=" + getStringTags(this.state.tags) : ""),
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
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(SearchHeader, {location: this.state.location, query: this.state.query, tags: this.state.tags, updateLocationValue: this.updateLocationValue, updateQueryValue: this.updateQueryValue, addTag: this.hostelsAddTag, removeTag: this.hostelsRemoveTag, removeSpecificTag: this.hostelsRemoveSpecificTag, alsoTags: this.state.alsoTags, addAlsoTag: this.addAlsoTag, removeSpecificAlsoTag: this.removeSpecificAlsoTag, getResults: this.getResults}), 
				React.createElement(Content, {results: this.state.results, displayedResults: this.state.displayedResults, displayMoreResults: this.displayMoreResults, searchId: this.state.searchId})
			)
		);
	}
});

var SearchHeader = React.createClass({displayName: "SearchHeader",
	render: function() {
		return (
			React.createElement("div", {className: "container-fluid header"}, 
				React.createElement(AutoCompleteSearch, React.__spread({},  this.props)), 
				React.createElement(AlsoTry, {ref: "also", location: this.props.location, tags: this.props.tags, alsoTags: this.props.alsoTags, addTag: this.props.addTag, removeSpecificAlsoTag: this.props.removeSpecificAlsoTag})
			)
		);
	}
});

var AutoCompleteSearch = React.createClass({displayName: "AutoCompleteSearch",
	render: function() {
		return (
			React.createElement("div", {className: "row no-horizontal-margins"}, 
				React.createElement("div", {className: "col-md-4 form-col-left"}, 
					React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Location")), 
					React.createElement(AutoCompleteInput, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations=", value: this.props.location, updateValue: this.props.updateLocationValue, getResults: this.props.getResults, tags: this.props.tags})
				), 
				React.createElement("div", {className: "col-md-8 form-col-center"}, 
					React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Tags")), 
					React.createElement(TripTailorAutoCompleteTags, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags=", value: this.props.query, updateValue: this.props.updateQueryValue, tags: this.props.tags, addTag: this.props.addTag, removeTag: this.props.removeTag, removeSpecificTag: this.props.removeSpecificTag})
				)
			)
		);
	}
});

var AutoCompleteInput = React.createClass({displayName: "AutoCompleteInput",
	mixins: [AutoCompleteMixin, AutoCompleteInputMixin],
	hostelsElementClick: function(elementValue) {
		this.elementClick(elementValue);
		this.props.getResults(elementValue, this.props.tags);
	},
	hostelsHandleKeyUp: function(e) {
		this.handleKeyUp(e);
		if(e.keyCode == 13 && this.state.selectedItem >= 0)
			this.props.getResults(this.state.hints[this.state.selectedItem], this.props.tags);
	},
	hostelsHandleKeyDown: function(e) {
		this.handleKeyDown(e);
		if(e.keyCode == 9 && this.state.selectedItem >= 0) {
			e.preventDefault();
			this.props.getResults(this.state.hints[this.state.selectedItem], this.props.tags);
		}
	},
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement("input", {ref: "query", type: "text", className: "form-control inline-input-left", placeholder: "Pick a city", autoComplete: "off", value: this.props.value, onChange: this.handleValueChanged, onKeyUp: this.hostelsHandleKeyUp, onBlur: this.handleBlur, onKeyDown: this.hostelsHandleKeyDown}), 
				this.state.hints.length > 0 ? React.createElement(TripTailorAutoCompleteResults, {hints: this.state.hints, selectedItem: this.state.selectedItem, elementClick: this.hostelsElementClick, elementHover: this.updateSelectedItem}) : ''
			)
		);
	}
});

var AlsoTry = React.createClass({displayName: "AlsoTry",
	render: function() {
		var tags = $.map(this.props.alsoTags, function(value, i) {
			return (
				React.createElement(AlsoTryTag, {key: i, index: i, name: value, add: this.props.addTag, remove: this.props.removeSpecificAlsoTag})
			);
		}.bind(this));

		return (
			React.createElement("div", {className: "row also"}, 
				React.createElement("div", {className: "col-md-12"}, 
					React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Also Try")), 
					React.createElement("div", {className: "also-tags-div"}, 
						tags
					)
				)
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

var Content = React.createClass({displayName: "Content",
	render: function() {
		return (
			React.createElement("div", {className: "container-fluid content"}, 
				React.createElement(NumberResults, {results: this.props.results.length}), 
				React.createElement(ResultsGrid, React.__spread({},  this.props))
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
		return {more: false};
	},
	showMoreTags: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState({more: true});
	},
	showLessTags: function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState({more: false});
	},
	render: function() {
		var rows = [];
		var results = [];
		for(var i = 0; i < this.props.results.length && i < this.props.displayedResults; i++) {
			results.push(React.createElement(Result, {key: i, result: this.props.results[i], moreTags: this.state.more, showMoreTags: this.showMoreTags, showLessTags: this.showLessTags, searchId: this.props.searchId}));
			if((i + 1) % 4 == 0) {
				rows.push(
					React.createElement("div", {key: rows.length, className: "row"}, 
						results
					)
				);
				results = [];
			}
		};
		if(results.length > 0) {
			rows.push(
				React.createElement("div", {key: rows.length, className: "row"}, 
					results
				)
			);
		}
		return (
			React.createElement("div", null, 
				rows, 
				this.props.results.length > this.props.displayedResults ? React.createElement("button", {className: "submit more-results", onClick: this.props.displayMoreResults}, "Show more results") : ''
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
		return (
			React.createElement("div", {className: "col-md-3"}, 
				React.createElement("div", {className: "result"}, 
					React.createElement("a", {href: this.props.result.url != 'null' ? this.props.result.url + "?affiliate=triptailor.co" : '#', target: "_blank", className: "result-a", onClick: this.handleClick}, 
					React.createElement("div", {className: "result-name"}, React.createElement("strong", null, this.props.result.name)), 
					React.createElement("div", {className: "result-price"}, this.props.result.price, " USD"), 
					React.createElement("div", {className: "result-book"}, React.createElement("div", {className: "info"}, "View in  HostelWorld")), 
					React.createElement(TagsRow, {tags: this.props.result.tags, more: this.props.moreTags, showMoreTags: this.props.showMoreTags, showLessTags: this.props.showLessTags})
					)
				)
			)
		);
	}
});

var TagsRow = React.createClass({displayName: "TagsRow",
	render: function() {
		var tags = [];
		var i = 0;
		for(; i < 4 && i < this.props.tags.length; i++) {
			tags.push(React.createElement(Tag, {key: i, name: this.props.tags[i].name, type: this.props.tags[i].type}));
		}
		if (!this.props.more) {
			tags.push(React.createElement("button", {key: this.props.tags.length + 1, className: "tag more-tags", onClick: this.props.showMoreTags}, "More"));
		}
		else {
			for(; i < this.props.tags.length; i++) {
				tags.push(React.createElement(Tag, {key: i, name: this.props.tags[i].name, type: this.props.tags[i].type}));
			}
			tags.push(React.createElement("button", {key: this.props.tags.length + 1, className: "tag more-tags", onClick: this.props.showLessTags}, "Less"));
		}

		return (
			React.createElement("div", {className: this.props.more ? "result-tags" : "result-tags tags-less"}, 
				tags
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

React.render(React.createElement(Hostels, null), document.getElementById("content"));
