var Header = React.createClass({
	render: function() {
		return (
			<div className="jumbotron">
				<div className="container-fluid">

					<div className="row">
						<div className="col-md-10 col-md-offset-1 text-center">
							<h1 className="header">Looking for a hostel?</h1>
							<p className="subheader">Pick a city and write some tags, and we will find the perfect match for you</p>
						</div>
					</div>

					<AutoCompleteSearch />

				</div>
			</div>
		);
	}
});

var Content = React.createClass({
	render: function() {
		return (
			<div className="container-fluid content">
				<div className="row tips-header-container">
					<div className="col-md-10 col-md-offset-1 text-center">
						<h2 className="tips-header">Popular Searches</h2>
						<p className="tips-subheader">Tips for your next trip</p>
					</div>
				</div>

				<div className="row">
					<div className="col-md-8">
						<a href={SEARCHURL + "?location=Istanbul,Turkey&tags=location-view-terrace"} className="tip-a">
							<div className="tip-big">
								<div className="tip-content-container">
									<div className="tip-content text-center">
										<h3><span className="medium">Istanbul</span>, Turkey</h3>
										<p>Location, View & Terrace</p>
										<div className="tip-results medium">145 Matches</div>
									</div>
								</div>
							</div>
						</a>
					</div>
					<div className="col-md-4">
						<div className="tip bangkok">
							<a href={SEARCHURL + "?location=Bangkok,Thailand&tags=clean-modern-spacious"} className="tip-a">
								<div className="tip-content-container">
									<div className="tip-content text-center">
										<h3><span className="medium">Bangkok</span>, Thailand</h3>
										<p>Clean, Modern & Spacious</p>
										<div className="tip-results medium">171 Matches</div>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>

				<div className="row bottom-tips">
					<div className="col-md-4">
						<div className="tip amsterdam">
							<a href={SEARCHURL + "?location=Amsterdam,Netherlands"} className="tip-a">
								<div className="tip-content-container">
									<div className="tip-content text-center">
										<h3><span className="medium">Amsterdam</span>, Netherlands</h3>
										<p>popular destination</p>
										<div className="tip-results medium">151 Results</div>
									</div>
								</div>
							</a>
						</div>
					</div>
					<div className="col-md-4">
						<div className="tip rio">
							<a href={SEARCHURL + "?location=Rio-de-Janeiro,Brazil&tags=fun-party-people"} className="tip-a">
								<div className="tip-content-container">
									<div className="tip-content text-center">
										<h3><span className="medium">Rio de Janeiro</span>, Brazil</h3>
										<p>Fun, People & Party</p>
										<div className="tip-results medium">177 Matches</div>
									</div>
								</div>
							</a>
						</div>
					</div>
					<div className="col-md-4">
						<div className="tip ny">
							<a href={SEARCHURL + "?location=New-York,USA&tags=breakfast-bar-artwork"} className="tip-a">
								<div className="tip-content-container">
									<div className="tip-content text-center">
										<h3><span className="medium">New York</span>, USA</h3>
										<p>Breakfast, Bar & Artwork</p>
										<div className="tip-results medium">55 Matches</div>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var Index = React.createClass({
	render: function() {
		return (
			<div>
				<Header />
				<Content />
			</div>
		);
	}
});

var AutoCompleteSearch = React.createClass({
	mixins: [AutoCompleteMixin],
	getInitialState: function() {
		return {location: '', query: '', tags: []};
	},
	submit: function(e) {
		/*if(cityVal == "")
			city.style.border = "2px solid #5F2B25"; */
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
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
					<div className="row form-row">
						<div className="col-md-5 form-col-left">
							<TripTailorAutoCompleteInput url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations="} value={this.state.location} updateValue={this.updateLocationValue} submit={this.enterSubmit} />
						</div>
						<div className="col-md-5 form-col-center">
							<TripTailorAutoCompleteTags url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags="} value={this.state.query} updateValue={this.updateQueryValue} submit={this.enterSubmit} tags={this.state.tags} addTag={this.addTag} removeTag={this.removeTag} removeSpecificTag={this.removeSpecificTag} />
						</div>
						<div className="col-md-2 a-col">
							<a ref="submit" className="submit" href="" onClick={this.submit}>Search</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

React.render(<Index />, document.getElementById("content"));
