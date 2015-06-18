var Header = React.createClass({
	render: function() {
		return (
			<div className="jumbotron">
				<div className="container-fluid">

					<TripTailorNavBar />

					<h1 className="header">To travel is to live</h1>
					<p className="subheader">Hans Christian Andersen</p>

				</div>
			</div>
		);
	}
});

var Menu = React.createClass({
	render: function() {
		return (
			<ul className="list-inline menu">
				<li><a href="#howItWorks">How It Works</a></li>
				<li><a href="#features">Features</a></li>
			</ul>
		);
	}
});

var Content = React.createClass({
	render: function() {
		return (
			<div className="container-fluid">
				<p id="howItWorks" className="title">How It Works</p>
				<div className="row no-horizontal-margins">
					<div className="col-md-3 step">
						<i className="fa fa-check-circle fa-3x"></i>
						<p className="step-title">1. Pick a city</p>
						<p className="step-text">Pick a city from hundreds of cities around the world</p>
					</div>
					<div className="col-md-3 step">
						<i className="fa fa-tags fa-3x"></i>
						<p className="step-title">2. Play with tags</p>
						<p className="step-text">Add and remove tags as you filter hostels</p>
					</div>
					<div className="col-md-3 step">
						<i className="fa fa-search fa-3x"></i>
						<p className="step-title">3. Browse hostels</p>
						<p className="step-text">Hostels where the tags are more relevant will be displayed first</p>
					</div>
					<div className="col-md-3 step">
						<i className="fa fa-bookmark fa-3x"></i>
						<p className="step-title">4. Book your hostel</p>
						<p className="step-text">Finish your booking with HostelWorld</p>
					</div>
				</div>

				<div className="features-container">
					<p id="features" className="title">Features</p>
					<div className="row no-horizontal-margins">
						<div className="col-md-3 step">
							<i className="fa fa-thumbs-o-up fa-3x"></i>
							<p className="step-title">Easy</p>
							<p className="step-text">Only pick a city and some tags</p>
						</div>
						<div className="col-md-3 step">
							<i className="fa fa-magic fa-3x"></i>
							<p className="step-title">Wise</p>
							<p className="step-text">The application knows the most relevant tags for each hostel</p>
						</div>
						<div className="col-md-3 step">
							<i className="fa fa-sort fa-3x"></i>
							<p className="step-title">Smart</p>
							<p className="step-text">The application knows how to sort the hostels, based on tags</p>
						</div>
						<div className="col-md-3 step">
							<i className="fa fa-rocket fa-3x"></i>
							<p className="step-title">Interactive</p>
							<p className="step-text">Play with tags as you refine your search</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var HIW = React.createClass({
	render: function() {
		return (
			<div>
				<Header />
				<Menu />
				<Content />
				<TripTailorFooter />
			</div>
		);
	}
});

React.render(<HIW />, document.body);
