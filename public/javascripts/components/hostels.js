var HOSTELSTODISPLAY = 16;

var Hostels = React.createClass({displayName: "Hostels",
	getInitialState: function() {
		return {location: city + ", " + country, query: '', tags: this.getArrayTags(getQueryValue("tags")), results: [], displayedResults: HOSTELSTODISPLAY, alsoTags: [], searchId: -1};
	},
	componentWillMount: function() {
		this.getResults(getStringTags(this.state.tags));
		this.getSuggestions();
	},
	updateLocationValue: function(value) {
		this.setState({location: value});
	},
	updateQueryValue: function(value) {
		this.setState({query: value});
	},
	addTag: function(value) {
		var tags = this.state.tags.slice(0, this.state.tags.length);
		tags.push(value);
		this.setState({tags: tags});
		this.getResults(getStringTags(tags));
	},
	removeTag: function() {
		var tags = this.state.tags.slice(0, this.state.tags.length - 1);
		this.setState({tags: tags});
		this.getResults(getStringTags(tags));
	},
	removeSpecificTag: function(i) {
		var tags = this.state.tags.slice(0, i).concat(this.state.tags.slice(i + 1, this.state.tags.length));
		this.setState({tags: tags});
		this.getResults(getStringTags(tags));
	},
	removeSpecificAlsoTag: function(i) {
		this.setState({alsoTags: this.state.alsoTags.slice(0, i).concat(this.state.alsoTags.slice(i + 1, this.state.alsoTags.length))});
	},
	displayMoreResults: function() {
		this.setState({displayedResults: this.state.displayedResults + HOSTELSTODISPLAY});
	},
	getResults: function(tags) {
		var route;
		var location = (city + "," + country).replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
		if (tags === "")
			route = jsRoutes.controllers.SearchController.displayAll(location);
		else
			route = jsRoutes.controllers.SearchController.classify(location, tags);
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
	getSuggestions: function() {
		var route = jsRoutes.controllers.HintsController.tagSuggestions();
		$.ajax({
			url: route.absoluteURL() + "?location=" + (city + "," + country) + (this.state.tags.length > 0 ? "&tags=" + getStringTags(this.state.tags) : ""),
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
				React.createElement(TripTailorNavBar, null), 
				React.createElement(SearchHeader, {location: this.state.location, query: this.state.query, tags: this.state.tags, updateLocationValue: this.updateLocationValue, updateQueryValue: this.updateQueryValue, addTag: this.addTag, removeTag: this.removeTag, removeSpecificTag: this.removeSpecificTag, alsoTags: this.state.alsoTags, addAlsoTag: this.addAlsoTag, removeSpecificAlsoTag: this.removeSpecificAlsoTag}), 
				React.createElement(Content, {results: this.state.results, displayedResults: this.state.displayedResults, displayMoreResults: this.displayMoreResults, searchId: this.state.searchId}), 
				React.createElement(TripTailorFooter, null)
			)
		);
	}
});

var SearchHeader = React.createClass({displayName: "SearchHeader",
	enterSubmit: function() {
		this.refs.also.enterSubmit();
	},
	render: function() {
		return (
			React.createElement("div", {className: "container-fluid header"}, 
				React.createElement(AutoCompleteSearch, React.__spread({},  this.props, {enterSubmit: this.enterSubmit})), 
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
					React.createElement(TripTailorAutoCompleteInput, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations=", value: this.props.location, updateValue: this.props.updateLocationValue, submit: this.props.enterSubmit})
				), 
				React.createElement("div", {className: "col-md-8 form-col-center"}, 
					React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Tags")), 
					React.createElement(TripTailorAutoCompleteTags, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags=", value: this.props.query, updateValue: this.props.updateQueryValue, submit: this.props.enterSubmit, tags: this.props.tags, addTag: this.props.addTag, removeTag: this.props.removeTag, removeSpecificTag: this.props.removeSpecificTag})
				)
			)
		);
	}
});

var AlsoTry = React.createClass({displayName: "AlsoTry",
	submit: function(e) {
		/*if(cityVal == "")
			city.style.border = "2px solid #5F2B25"; */
		if(this.props.location == '') {
			e.preventDefault();
			return;
		}
		var url = SEARCHURL + "?location=" + this.props.location.replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
		if(this.props.tags.length > 0) {
			url += "&tags=" + this.props.tags[0];
			for(var i = 1; i < this.props.tags.length; i++)
			url += "-" + this.props.tags[i];
		}
		React.findDOMNode(this.refs.submit).href = url + adVariables();
	},
	enterSubmit: function() {
		React.findDOMNode(this.refs.submit).click();
	},
	render: function() {
		var tags = $.map(this.props.alsoTags, function(value, i) {
			return (
				React.createElement(AlsoTryTag, {key: i, index: i, name: value, add: this.props.addTag, remove: this.props.removeSpecificAlsoTag})
			);
		}.bind(this));

		return (
			React.createElement("div", {className: "row also"}, 
				React.createElement("div", {className: "col-md-10"}, 
					React.createElement("p", {className: "header-label"}, React.createElement("strong", null, "Also Try")), 
					React.createElement("div", {className: "also-tags-div"}, 
						tags
					)
				), 
				React.createElement("div", {className: "col-md-2 submit-col"}, 
					React.createElement("a", {ref: "submit", className: "submit", href: "", onClick: this.submit}, "Search")
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
		this.setState({more: true});
	},
	showLessTags: function(e) {
		e.preventDefault();
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
		$.ajax({
			url: jsRoutes.controllers.StatsController.saveHostelClick(),
			dataType: 'application/x-www-form-urlencoded',
			type: route.type,
			data: {hostelId: this.props.result.id, searchId: this.props.searchId},
			success: function() {
				console.log("Hostel click saved");
			},
			error: function(xhr, status, err) {
				console.error(route.absoluteURL(), status, err.toString());
			}.bind(this)
		});
	},
	render: function() {
		return (
			React.createElement("div", {className: "col-md-3"}, 
				React.createElement("div", {className: "result"}, 
					React.createElement("a", {href: this.props.result.url != 'null' ? this.props.result.url + "?affiliate=triptailor.co" : '#', target: "_blank", className: "result-a"}, 
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

React.render(React.createElement(Hostels, null), document.body);
