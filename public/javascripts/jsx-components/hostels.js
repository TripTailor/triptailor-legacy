var HOSTELSTODISPLAY = 16;

var Hostels = React.createClass({
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
			<div>
				<TripTailorNavBar />
				<SearchHeader location={this.state.location} query={this.state.query} tags={this.state.tags} updateLocationValue={this.updateLocationValue} updateQueryValue={this.updateQueryValue} addTag={this.addTag} removeTag={this.removeTag} removeSpecificTag={this.removeSpecificTag} alsoTags={this.state.alsoTags} addAlsoTag={this.addAlsoTag} removeSpecificAlsoTag={this.removeSpecificAlsoTag} />
				<Content results={this.state.results} displayedResults={this.state.displayedResults} displayMoreResults={this.displayMoreResults} searchId={this.state.searchId} />
				<TripTailorFooter />
			</div>
		);
	}
});

var SearchHeader = React.createClass({
	enterSubmit: function() {
		this.refs.also.enterSubmit();
	},
	render: function() {
		return (
			<div className="container-fluid header">
				<AutoCompleteSearch {...this.props} enterSubmit={this.enterSubmit} />
				<AlsoTry ref="also" location={this.props.location} tags={this.props.tags} alsoTags={this.props.alsoTags} addTag={this.props.addTag} removeSpecificAlsoTag={this.props.removeSpecificAlsoTag} />
			</div>
		);
	}
});

var AutoCompleteSearch = React.createClass({
	render: function() {
		return (
			<div className="row no-horizontal-margins">
				<div className="col-md-4 form-col-left">
					<p className="header-label" ><strong>Location</strong></p>
					<TripTailorAutoCompleteInput url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations="} value={this.props.location} updateValue={this.props.updateLocationValue} submit={this.props.enterSubmit} />
				</div>
				<div className="col-md-8 form-col-center">
					<p className="header-label" ><strong>Tags</strong></p>
					<TripTailorAutoCompleteTags url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags="} value={this.props.query} updateValue={this.props.updateQueryValue} submit={this.props.enterSubmit} tags={this.props.tags} addTag={this.props.addTag} removeTag={this.props.removeTag} removeSpecificTag={this.props.removeSpecificTag} />
				</div>
			</div>
		);
	}
});

var AlsoTry = React.createClass({
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
				<AlsoTryTag key={i} index={i} name={value} add={this.props.addTag} remove={this.props.removeSpecificAlsoTag} />
			);
		}.bind(this));

		return (
			<div className="row also">
				<div className="col-md-10">
					<p className="header-label"><strong>Also Try</strong></p>
					<div className="also-tags-div">
						{tags}
					</div>
				</div>
				<div className="col-md-2 submit-col">
					<a ref="submit" className="submit" href="" onClick={this.submit}>Search</a>
				</div>
			</div>
		);
	}
});

var AlsoTryTag = React.createClass({
	handleClick: function() {
		this.props.add(this.props.name);
		this.props.remove(this.props.index);
	},
	render: function() {
		return (
			<div className="tag tag-unselected tag-also" onClick={this.handleClick}>{this.props.name}</div>
		);
	}
});

var Content = React.createClass({
	render: function() {
		return (
			<div className="container-fluid content">
				<NumberResults results={this.props.results.length} />
				<ResultsGrid {...this.props} />
			</div>
		);
	}
});

var NumberResults = React.createClass({
	render: function() {
		return (
			<p className="results-number">Matching results <strong>{this.props.results}</strong></p>
		);
	}
});

var ResultsGrid = React.createClass({
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
			results.push(<Result key={i} result={this.props.results[i]} moreTags={this.state.more} showMoreTags={this.showMoreTags} showLessTags={this.showLessTags} searchId={this.props.searchId} />);
			if((i + 1) % 4 == 0) {
				rows.push(
					<div key={rows.length} className="row">
						{results}
					</div>
				);
				results = [];
			}
		};
		if(results.length > 0) {
			rows.push(
				<div key={rows.length} className="row">
					{results}
				</div>
			);
		}
		return (
			<div>
				{rows}
				{this.props.results.length > this.props.displayedResults ? <button className="submit more-results" onClick={this.props.displayMoreResults}>Show more results</button> : ''}
			</div>
		);
	}
});

var Result = React.createClass({
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
			<div className="col-md-3">
				<div className="result">
					<a href={this.props.result.url != 'null' ? this.props.result.url + "?affiliate=triptailor.co" : '#'} target="_blank" className="result-a" onClick={this.handleClick}>
					<div className="result-name"><strong>{this.props.result.name}</strong></div>
					<div className="result-price">{this.props.result.price} USD</div>
					<div className="result-book"><div className="info">View in  HostelWorld</div></div>
					<TagsRow tags={this.props.result.tags} more={this.props.moreTags} showMoreTags={this.props.showMoreTags} showLessTags={this.props.showLessTags} />
					</a>
				</div>
			</div>
		);
	}
});

var TagsRow = React.createClass({
	render: function() {
		var tags = [];
		var i = 0;
		for(; i < 4 && i < this.props.tags.length; i++) {
			tags.push(<Tag key={i} name={this.props.tags[i].name} type={this.props.tags[i].type} />);
		}
		if (!this.props.more) {
			tags.push(<button key={this.props.tags.length + 1} className="tag more-tags" onClick={this.props.showMoreTags}>More</button>);
		}
		else {
			for(; i < this.props.tags.length; i++) {
				tags.push(<Tag key={i} name={this.props.tags[i].name} type={this.props.tags[i].type} />);
			}
			tags.push(<button key={this.props.tags.length + 1} className="tag more-tags" onClick={this.props.showLessTags}>Less</button>);
		}

		return (
			<div className={this.props.more ? "result-tags" : "result-tags tags-less"}>
				{tags}
			</div>
		);
	}
});

var Tag = React.createClass({
	render: function() {
		return (
			<div className={this.props.type == 0 ? "tag tag-selected" : "tag tag-unselected"}>{this.props.name}</div>
		);
	}
});

React.render(<Hostels />, document.body);
