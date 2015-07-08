var BASEURL    = jsRoutes.controllers.ApplicationController.index().absoluteURL();
var SEARCHURL  = jsRoutes.controllers.SearchController.search().absoluteURL();
var TIMEOUT    = 200;

var TripTailorNavBar = React.createClass({displayName: "TripTailorNavBar",
	render: function() {
		return (
			React.createElement("nav", {className: "navbar navbar-triptailor"}, 
				React.createElement("div", {className: "container-fluid"}, 
					React.createElement("div", {className: "navbar-header"}, 
						React.createElement("button", {type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#bs-example-navbar-collapse-1"}, 
							React.createElement("span", {className: "sr-only"}, "Toggle navigation"), 
							React.createElement("span", {className: "icon-bar"}), 
							React.createElement("span", {className: "icon-bar"}), 
							React.createElement("span", {className: "icon-bar"})
						), 
						React.createElement("a", {className: "navbar-brand", href: BASEURL}, React.createElement("span", {className: "medium"}, "TripTailor"), " Hostels")
					), 

					React.createElement("div", {className: "collapse navbar-collapse", id: "bs-example-navbar-collapse-1"}, 
						React.createElement("ul", {className: "nav navbar-nav navbar-right"}, 
							React.createElement("li", null, React.createElement("a", {href: jsRoutes.controllers.ApplicationController.howItWorks().absoluteURL()}, "How it works")), 
							/* <li><a href="#">About us</a></li> */
							/* <li><a className="a-addthis" href="#"><div className="addthis_sharing_toolbox addthis_top"></div></a></li> */
							React.createElement("li", null, 
								React.createElement("a", {className: "fb-link", href: "#", onClick: shareFB}, React.createElement("img", {src: jsRoutes.controllers.Assets.at("images/fb-20.png").absoluteURL()})), 
								React.createElement("a", {className: "tw-link", href: "https://twitter.com/intent/tweet?text=&url=" + encodeURIComponent(window.location.href)}, React.createElement("img", {src: jsRoutes.controllers.Assets.at("images/tw-20.png").absoluteURL()}))
							)
						)
					)
				)
			)
		);
	}
});

var TripTailorFooter = React.createClass({displayName: "TripTailorFooter",
	render: function() {
		return (
			React.createElement("div", {className: "container-fluid footer"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-sm-4"}, 
						React.createElement("p", {className: "footer-header"}, "Company"), 
						React.createElement("ul", {className: "list-unstyled footer-list"}, 
							React.createElement("li", null, React.createElement("a", {href: jsRoutes.controllers.ApplicationController.howItWorks().absoluteURL()}, "How it works"))
							/* <li>About Us</li>
									<li>Contact</li> */
						)
					), 
					React.createElement("div", {className: "col-sm-4 love"}, 
						React.createElement("p", {className: "footer-header"}, "Spread the love"), 
						/* <div className="addthis_sharing_toolbox"></div> */
						React.createElement("ul", {className: "list-inline"}, 
							React.createElement("li", null, React.createElement("a", {className: "fb-link", href: "#", onClick: shareFB}, React.createElement("img", {src: jsRoutes.controllers.Assets.at("images/fb-25.png").absoluteURL()}))), 
							React.createElement("li", null, React.createElement("a", {className: "tw-link", href: "https://twitter.com/intent/tweet?text=&url=" + encodeURIComponent(window.location.href)}, React.createElement("img", {src: jsRoutes.controllers.Assets.at("images/tw-25.png").absoluteURL()})))
						)
					)
				), 
				React.createElement("div", {className: "row disclaimer"}, 
					React.createElement("div", {className: "col-sm-12"}, 
						React.createElement("p", null, "© TripTailor")
					)
				)
			)
		);
	}
});

var AutoCompleteMixin = {
	getInitialState: function() {
		return {hints: [], selectedItem: -1};
	},
	getHints: function() {
		var input = React.findDOMNode(this.refs.query);
		var value = input.value;
		setTimeout(function() {
			if(value != '' && value == input.value) {
				$.ajax({
					url: this.props.url + this.props.value.trim().replace(/ /g, "-"),
					dataType: 'json',
					type: 'GET',
					success: function(data) {
						var item = data.length > 0 ? 0 : -1;
						this.setState({hints: data, selectedItem: item});
					}.bind(this),
					error: function(xhr, status, err) {
						console.error(this.props.url, status, err.toString());
					}.bind(this)
				});
			}
			else
				this.setState({hints: [], selectedItem: -1});
		}.bind(this), TIMEOUT);
	},
	handleValueChanged: function() {
		this.props.updateValue(React.findDOMNode(this.refs.query).value);
		this.getHints();
	},
	updateSelectedItem: function(i) {
		this.setState({selectedItem: i});
	},
	handleBlur: function() {
		this.setState({hints: [], selectedItem: -1});
	}
};

var TripTailorAutoCompleteInput = React.createClass({displayName: "TripTailorAutoCompleteInput",
	mixins: [AutoCompleteMixin],
	elementClick: function(elementValue) {
		this.props.updateValue(elementValue);
		this.setState({hints: [], selectedItem: -1});
	},
	handleKeyUp: function(e) {
		if(e.keyCode == 27)
			this.setState({hints: [], selectedItem: -1});
		else if(e.keyCode == 13) {
			if(this.state.selectedItem >= 0) {
				this.props.updateValue(this.state.hints[this.state.selectedItem]);
				this.setState({hints: [], selectedItem: -1});
			}
			else
				this.props.submit();
		}
	},
	handleKeyDown: function(e) {
		if(e.keyCode == 40 && this.state.selectedItem < this.state.hints.length - 1) {
			this.setState({selectedItem: this.state.selectedItem + 1});
		}
		else if(e.keyCode == 38 && this.state.selectedItem > 0) {
			this.setState({selectedItem: this.state.selectedItem - 1});
		}
		else if(e.keyCode == 9 && this.state.selectedItem >= 0) {
			e.preventDefault();
			this.props.updateValue(this.state.hints[this.state.selectedItem]);
			this.setState({hints: [], selectedItem: -1});
		}
	},
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement("input", {ref: "query", type: "text", className: "form-control inline-input-left", placeholder: "Pick a city", autoComplete: "off", value: this.props.value, onChange: this.handleValueChanged, onKeyUp: this.handleKeyUp, onBlur: this.handleBlur, onKeyDown: this.handleKeyDown}), 
				this.state.hints.length > 0 ? React.createElement(TripTailorAutoCompleteResults, {hints: this.state.hints, selectedItem: this.state.selectedItem, elementClick: this.elementClick, elementHover: this.updateSelectedItem}) : ''
			)
		);
	}
});

var TripTailorAutoCompleteResults = React.createClass({displayName: "TripTailorAutoCompleteResults",
	cancelParentBlur: function(e) {
		e.preventDefault();
	},
	scrollToRow: function(row) {
		var autocomplete = React.findDOMNode(this.refs.autocomplete);
		var rowPos = $(row).position();
		var autocompletePos = $(autocomplete).position();
		if((rowPos.top + $(row).height()) > (autocompletePos.top + $(autocomplete).height()))
			$(autocomplete).scrollTop($(autocomplete).scrollTop() + 38);
		else if(rowPos.top < autocompletePos.top)
			$(autocomplete).scrollTop($(autocomplete).scrollTop() - 38);
	},
	render: function() {
		var rows = $.map(this.props.hints, function(value, i) {
			return(
				React.createElement(TripTailorAutoCompleteRow, {value: value, key: i, index: i, selectedItem: this.props.selectedItem, elementClick: this.props.elementClick, elementHover: this.props.elementHover, scrollToThis: this.scrollToRow})
			);
		}.bind(this));

		return (
			React.createElement("div", {className: "relative"}, 
				React.createElement("div", {ref: "autocomplete", className: "autocomplete", onMouseDown: this.cancelParentBlur}, 
					rows	
				)
			)
		);
	}
});

var TripTailorAutoCompleteRow = React.createClass({displayName: "TripTailorAutoCompleteRow",
	componentDidUpdate: function() {
		if(this.props.selectedItem == this.props.index)
			this.props.scrollToThis(React.findDOMNode(this));
	},
	handleClick: function() {
		this.props.elementClick(this.props.value);
	},
	handleMouseOver: function() {
		this.props.elementHover(this.props.index);
	},
	render: function() {
		return (
			React.createElement("p", {className: this.props.selectedItem == this.props.index ? "autocomplete-element selected" : "autocomplete-element", onClick: this.handleClick, onMouseOver: this.handleMouseOver}, this.props.value)
		);
	}
});

var TripTailorAutoCompleteTags = React.createClass({displayName: "TripTailorAutoCompleteTags",
	mixins: [AutoCompleteMixin],
	componentDidUpdate: function() {
		var input = React.findDOMNode(this.refs.query);
		if($(input).width() < 36)
			input.setAttribute("readonly", true);
		else
			input.removeAttribute("readonly");

		var size = 30;
		for(var i = 0; i < this.props.tags.length; i++)
			size += $(React.findDOMNode(this.refs["tag-" + i])).width() + 10;
		if(size > $(React.findDOMNode(this.refs["tags-container"])).width())
			this.props.removeTag();
	},
	elementClick: function(elementValue) {
		this.props.addTag(elementValue);
		this.props.updateValue("");
		this.setState({hints: [], selectedItem: -1});
	},
	handleKeyUp: function(e) {
		if(e.keyCode == 27) {
			this.props.addTag(React.findDOMNode(this.refs.query).value.toLowerCase());
			this.props.updateValue("");
			this.setState({hints: [], selectedItem: -1});
		}
		else if(e.keyCode == 13) {
			if(this.state.selectedItem >= 0) {
				this.props.addTag(this.state.hints[this.state.selectedItem]);
				this.props.updateValue("");
				this.setState({hints: [], selectedItem: -1});
			}
			else
				this.props.submit();
		}
		else if(e.keyCode == 32) {
			this.props.addTag(this.props.value.trim().toLowerCase());
			this.props.updateValue("");
		}
	},
	handleKeyDown: function(e) {
		if(e.keyCode == 40 && this.state.selectedItem < this.state.hints.length - 1) {
			e.preventDefault();
			this.setState({selectedItem: this.state.selectedItem + 1});
		}
		else if(e.keyCode == 38 && this.state.selectedItem > 0) {
			e.preventDefault();
			this.setState({selectedItem: this.state.selectedItem - 1});
		}
		else if(e.keyCode == 9 && this.state.selectedItem >= 0) {
			e.preventDefault();
			this.props.addTag(this.state.hints[this.state.selectedItem]);
			this.props.updateValue("");
			this.setState({hints: [], selectedItem: -1});
		}
		else if(e.keyCode == 8 && this.props.value == "") {
			this.props.removeTag();
		}
	},
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
						React.createElement("input", {ref: "query", type: "text", className: "form-control input-tags", placeholder: "Write some tags", autoComplete: "off", value: this.props.value, onChange: this.handleValueChanged, onKeyUp: this.handleKeyUp, onBlur: this.handleBlur, onKeyDown: this.handleKeyDown})
					)
				), 
				this.state.hints.length > 0 ? React.createElement(TripTailorAutoCompleteResults, {hints: this.state.hints, selectedItem: this.state.selectedItem, elementClick: this.elementClick, elementHover: this.updateSelectedItem}) : ''
			)
		);
	}
});

var TripTailorInputTag = React.createClass({displayName: "TripTailorInputTag",
	remove: function() {
		this.props.removeSpecificTag(this.props.index);
	},
	render: function() {
		return (
			React.createElement("div", {className: "input-tag", onClick: SCREEN_WIDTH < WIDTH_BREAKPOINT ? this.remove : ''}, this.props.value, React.createElement("span", {className: "close-tag", onClick: this.remove}, React.createElement("strong", null, "x")))
		);
	}
});

var TripTailorLoader = React.createClass({displayName: "TripTailorLoader",
	render: function() {
		return (
			React.createElement("div", {className: "loader"}, 
				React.createElement("img", {src: "../images/loader.gif"})
			)
		);
	}
});
