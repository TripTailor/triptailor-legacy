var Header = React.createClass({
	render: function() {
		return (
			<div className="jumbotron">
				<div className="container-fluid">

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
						<p className="step-text">Finish your booking with our friends at HostelWorld</p>
					</div>
				</div>

				<div className="features-container">
					<p id="features" className="title">Features</p>
					<div className="row no-horizontal-margins">
						<div className="col-md-3 step">
							<i className="fa fa-expand fa-3x"></i>
							<p className="step-title">Exhaustive</p>
							<p className="step-text">We browsed the web to find what people were saying about almost every hostel in the world</p>
						</div>
						<div className="col-md-3 step">
							<i className="fa fa-magic fa-3x"></i>
							<p className="step-title">Smart</p>
							<p className="step-text">We made a Natural Language Processing analysis on that information, to get the relevant keywords</p>
						</div>
						<div className="col-md-3 step">
							<i className="fa fa-arrows fa-3x"></i>
							<p className="step-title">Contextual</p>
							<p className="step-text">Hostel tags are keywords that people mentioned a lot, in a positive context</p>
						</div>
						<div className="col-md-3 step">
							<i className="fa fa-dot-circle-o fa-3x"></i>
							<p className="step-title">Intuitive</p>
							<p className="step-text">We sort the hostels for each search you make, to give you the most relevant hostels</p>
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
			</div>
		);
	}
});

React.render(<HIW />, document.getElementById("content"));
