var Header = React.createClass({displayName: "Header",
	render: function() {
		return (
			React.createElement("div", {className: "jumbotron"}, 
				React.createElement("div", {className: "container-fluid"}, 

					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-md-10 col-md-offset-1 text-center"}, 
							React.createElement("h1", {className: "header"}, "Looking for a hostel?"), 
							React.createElement("p", {className: "subheader"}, "Pick a city and write some tags, and we will find the perfect match for you")
						)
					), 

					React.createElement(AutoCompleteSearch, null)

				)
			)
		);
	}
});

var Content = React.createClass({displayName: "Content",
	render: function() {
		return (
			React.createElement("div", {className: "container-fluid content"}, 
				React.createElement("div", {className: "row tips-header-container"}, 
					React.createElement("div", {className: "col-md-10 col-md-offset-1 text-center"}, 
						React.createElement("h2", {className: "tips-header"}, "Popular Searches"), 
						React.createElement("p", {className: "tips-subheader"}, "Tips for your next trip")
					)
				), 

				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-md-8"}, 
						React.createElement("a", {href: SEARCHURL + "?location=Istanbul,Turkey&tags=location-view-terrace", className: "tip-a"}, 
							React.createElement("div", {className: "tip-big"}, 
								React.createElement("div", {className: "tip-content-container"}, 
									React.createElement("div", {className: "tip-content text-center"}, 
										React.createElement("h3", null, React.createElement("span", {className: "medium"}, "Istanbul"), ", Turkey"), 
										React.createElement("p", null, "Location, View & Terrace"), 
										React.createElement("div", {className: "tip-results medium"}, "145 Matches")
									)
								)
							)
						)
					), 
					React.createElement("div", {className: "col-md-4"}, 
						React.createElement("div", {className: "tip bangkok"}, 
							React.createElement("a", {href: SEARCHURL + "?location=Bangkok,Thailand&tags=clean-modern-spacious", className: "tip-a"}, 
								React.createElement("div", {className: "tip-content-container"}, 
									React.createElement("div", {className: "tip-content text-center"}, 
										React.createElement("h3", null, React.createElement("span", {className: "medium"}, "Bangkok"), ", Thailand"), 
										React.createElement("p", null, "Clean, Modern & Spacious"), 
										React.createElement("div", {className: "tip-results medium"}, "171 Matches")
									)
								)
							)
						)
					)
				), 

				React.createElement("div", {className: "row bottom-tips"}, 
					React.createElement("div", {className: "col-md-4"}, 
						React.createElement("div", {className: "tip amsterdam"}, 
							React.createElement("a", {href: SEARCHURL + "?location=Amsterdam,Netherlands", className: "tip-a"}, 
								React.createElement("div", {className: "tip-content-container"}, 
									React.createElement("div", {className: "tip-content text-center"}, 
										React.createElement("h3", null, React.createElement("span", {className: "medium"}, "Amsterdam"), ", Netherlands"), 
										React.createElement("p", null, "popular destination"), 
										React.createElement("div", {className: "tip-results medium"}, "151 Results")
									)
								)
							)
						)
					), 
					React.createElement("div", {className: "col-md-4"}, 
						React.createElement("div", {className: "tip rio"}, 
							React.createElement("a", {href: SEARCHURL + "?location=Rio-de-Janeiro,Brazil&tags=fun-party-people", className: "tip-a"}, 
								React.createElement("div", {className: "tip-content-container"}, 
									React.createElement("div", {className: "tip-content text-center"}, 
										React.createElement("h3", null, React.createElement("span", {className: "medium"}, "Rio de Janeiro"), ", Brazil"), 
										React.createElement("p", null, "Fun, People & Party"), 
										React.createElement("div", {className: "tip-results medium"}, "177 Matches")
									)
								)
							)
						)
					), 
					React.createElement("div", {className: "col-md-4"}, 
						React.createElement("div", {className: "tip ny"}, 
							React.createElement("a", {href: SEARCHURL + "?location=New-York,USA&tags=breakfast-bar-artwork", className: "tip-a"}, 
								React.createElement("div", {className: "tip-content-container"}, 
									React.createElement("div", {className: "tip-content text-center"}, 
										React.createElement("h3", null, React.createElement("span", {className: "medium"}, "New York"), ", USA"), 
										React.createElement("p", null, "Breakfast, Bar & Artwork"), 
										React.createElement("div", {className: "tip-results medium"}, "55 Matches")
									)
								)
							)
						)
					)
				)
			)
		);
	}
});

var Index = React.createClass({displayName: "Index",
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(Header, null), 
				React.createElement(Content, null)
			)
		);
	}
});

var AutoCompleteSearch = React.createClass({displayName: "AutoCompleteSearch",
	mixins: [AutoCompleteContainerMixin],
	getInitialState: function() {
		return {location: '', query: '', tags: []};
	},
	submit: function(e) {
		if(this.state.location == '') {
			e.preventDefault();
			return;
		}
		var url = SEARCHURL + "?location=" + this.state.location.replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
		if(this.state.tags.length > 0) {
			url += "&tags=" + this.state.tags[0];
			for(var i = 1; i < this.state.tags.length; i++)
			url += "-" + this.state.tags[i];
		}
		React.findDOMNode(this.refs.submit).href = url + adVariables();
	},
	enterSubmit: function() {
		React.findDOMNode(this.refs.submit).click();
	},
	render: function() {
		return (
			React.createElement("div", {className: "row"}, 
				React.createElement("div", {className: "col-md-10 col-md-offset-1"}, 
					React.createElement("div", {className: "row form-row"}, 
						React.createElement("div", {className: "col-md-5 form-col-left"}, 
							React.createElement(AutoCompleteInput, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations=", value: this.state.location, updateValue: this.updateLocationValue, submit: this.enterSubmit})
						), 
						React.createElement("div", {className: "col-md-5 form-col-center"}, 
							React.createElement(TripTailorAutoCompleteTags, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags=", value: this.state.query, updateValue: this.updateQueryValue, submit: this.enterSubmit, tags: this.state.tags, addTag: this.addTag, removeTag: this.removeTag, removeSpecificTag: this.removeSpecificTag})
						), 
						React.createElement("div", {className: "col-md-2 a-col"}, 
							React.createElement("a", {ref: "submit", className: "submit", href: "", onClick: this.submit}, "Search")
						)
					)
				)
			)
		);
	}
});

var AutoCompleteInput = React.createClass({displayName: "AutoCompleteInput",
	mixins: [AutoCompleteMixin, AutoCompleteInputMixin],
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement("input", {ref: "query", type: "text", className: "form-control inline-input-left", placeholder: "Pick a city", autoComplete: "off", value: this.props.value, onChange: this.handleValueChanged, onKeyUp: this.handleKeyUp, onBlur: this.handleBlur, onKeyDown: this.handleKeyDown}), 
				this.state.hints.length > 0 ? React.createElement(TripTailorAutoCompleteResults, {hints: this.state.hints, selectedItem: this.state.selectedItem, elementClick: this.elementClick, elementHover: this.updateSelectedItem}) : ''
			)
		);
	}
});

React.render(React.createElement(Index, null), document.getElementById("content"));
