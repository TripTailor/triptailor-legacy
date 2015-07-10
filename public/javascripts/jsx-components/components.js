var BASEURL    = jsRoutes.controllers.ApplicationController.index().absoluteURL();
var SEARCHURL  = jsRoutes.controllers.SearchController.search().absoluteURL();
var TIMEOUT    = 200;

var TripTailorNavBar = React.createClass({
	render: function() {
		return (
			<nav className="navbar navbar-triptailor">
				<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href={BASEURL}><span className="medium">TripTailor</span> Hostels</a>
					</div>

					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul className="nav navbar-nav navbar-right">
							<li><a href={jsRoutes.controllers.ApplicationController.howItWorks().absoluteURL()}>How it works</a></li>
							{/* <li><a href="#">About us</a></li> */}
							{/* <li><a className="a-addthis" href="#"><div className="addthis_sharing_toolbox addthis_top"></div></a></li> */}
							<li>
								<a className="fb-link" href="#" onClick={shareFB}><img src={jsRoutes.controllers.Assets.at("images/fb-20.png").absoluteURL()}></img></a>
								<a className="tw-link" href={"https://twitter.com/intent/tweet?text=&url=" + encodeURIComponent(window.location.href)}><img src={jsRoutes.controllers.Assets.at("images/tw-20.png").absoluteURL()}></img></a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
});

var TripTailorFooter = React.createClass({
	render: function() {
		return (
			<div className="container-fluid footer">
				<div className="row">
					<div className="col-sm-4">
						<p className="footer-header">Company</p>
						<ul className="list-unstyled footer-list">
							<li><a href={jsRoutes.controllers.ApplicationController.howItWorks().absoluteURL()}>How it works</a></li>
							{/* <li>About Us</li>
									<li>Contact</li> */}
						</ul>
					</div>
					<div className="col-sm-4 love">
						<p className="footer-header">Spread the love</p>
						{/* <div className="addthis_sharing_toolbox"></div> */}
						<ul className="list-inline">
							<li><a className="fb-link" href="#" onClick={shareFB}><img src={jsRoutes.controllers.Assets.at("images/fb-25.png").absoluteURL()}></img></a></li>
							<li><a className="tw-link" href={"https://twitter.com/intent/tweet?text=&url=" + encodeURIComponent(window.location.href)}><img src={jsRoutes.controllers.Assets.at("images/tw-25.png").absoluteURL()}></img></a></li>
						</ul>
					</div>
				</div>
				<div className="row disclaimer">
					<div className="col-sm-12">
						<p>&copy; TripTailor</p>
					</div>
				</div>
			</div>
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
			if(value.trim().length > 0 && $(input).is(":focus") && value == input.value) {
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

var TripTailorAutoCompleteInput = React.createClass({
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
			this.props.updateValue(this.state.hints[this.state.selectedItem]);
			this.setState({hints: [], selectedItem: -1});
		}
	},
	render: function() {
		return (
			<div>
				<input ref="query" type="text" className="form-control inline-input-left" placeholder="Pick a city" autoComplete="off" value={this.props.value} onChange={this.handleValueChanged} onKeyUp={this.handleKeyUp} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />
				{this.state.hints.length > 0 ? <TripTailorAutoCompleteResults hints={this.state.hints} selectedItem={this.state.selectedItem} elementClick={this.elementClick} elementHover={this.updateSelectedItem} /> : ''}
			</div>
		);
	}
});

var TripTailorAutoCompleteResults = React.createClass({
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
				<TripTailorAutoCompleteRow value={value} key={i} index={i} selectedItem={this.props.selectedItem} elementClick={this.props.elementClick} elementHover={this.props.elementHover} scrollToThis={this.scrollToRow} />
			);
		}.bind(this));

		return (
			<div className="relative">
				<div ref="autocomplete" className="autocomplete" onMouseDown={this.cancelParentBlur}>
					{rows}	
				</div>
			</div>
		);
	}
});

var TripTailorAutoCompleteRow = React.createClass({
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
			<p className={this.props.selectedItem == this.props.index ? "autocomplete-element selected" : "autocomplete-element"} onClick={this.handleClick} onMouseOver={this.handleMouseOver} >{this.props.value}</p>
		);
	}
});

var TripTailorAutoCompleteTags = React.createClass({
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
			var value = React.findDOMNode(this.refs.query).value;
			if(value.length > 0)
				this.props.addTag(value.toLowerCase());
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
			if(this.props.value.trim().length > 0)
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
				<TripTailorInputTag ref={"tag-" + i} key={i} index={i} value={value} removeSpecificTag={this.props.removeSpecificTag} />
			);
		}.bind(this));

		return (
			<div ref="tags-container" className="autocomplete-tags-container">
				<div className="tag-search-container">
					{tags}
					<div className="tag-search-input">
						<input ref="query" type="text" className="form-control input-tags" placeholder={this.props.tags.length == 0 ? "Write some tags" : ""} autoComplete="off" value={this.props.value} onChange={this.handleValueChanged} onKeyUp={this.handleKeyUp} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />
					</div>
				</div>
				{this.state.hints.length > 0 ? <TripTailorAutoCompleteResults hints={this.state.hints} selectedItem={this.state.selectedItem} elementClick={this.elementClick} elementHover={this.updateSelectedItem} /> : ''}
			</div>
		);
	}
});

var TripTailorInputTag = React.createClass({
	remove: function() {
		this.props.removeSpecificTag(this.props.index);
	},
	render: function() {
		return (
			<div className="input-tag" onClick={SCREEN_WIDTH < WIDTH_BREAKPOINT ? this.remove : ''}>{this.props.value}<span className="close-tag" onClick={this.remove}><strong>x</strong></span></div>
		);
	}
});

var TripTailorLoader = React.createClass({
	render: function() {
		return (
			<div className="loader">
				<img src="../images/loader.gif" />
			</div>
		);
	}
});
