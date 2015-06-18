var Header = React.createClass({displayName: "Header",
	render: function() {
		return (
			React.createElement("div", {className: "jumbotron"}, 
				React.createElement("div", {className: "container-fluid container-jumbotron"}, 

					React.createElement(TripTailorNavBar, null), 

					React.createElement("h1", {className: "header"}, "To travel is to live"), 
					React.createElement("p", {className: "subheader"}, "Hans Christian Andersen")

				)
			)
		);
	}
});

var Menu = React.createClass({displayName: "Menu",
	render: function() {
		return (
			React.createElement("ul", {className: "list-inline menu"}, 
				React.createElement("li", null, React.createElement("a", {href: "#howItWorks"}, "How It Works")), 
				React.createElement("li", null, React.createElement("a", {href: "#features"}, "Features"))
			)
		);
	}
});

var Content = React.createClass({displayName: "Content",
	render: function() {
		return (
			React.createElement("div", {className: "container-fluid container-jumbotron"}, 
				React.createElement("p", {id: "howItWorks", className: "title"}, "How It Works"), 
				React.createElement("div", {className: "row no-horizontal-margins row-container"}, 
					React.createElement("div", {className: "col-md-3 step"}, 
						React.createElement("i", {className: "fa fa-check-circle fa-3x"}), 
						React.createElement("p", {className: "step-title"}, "1. Pick a city"), 
						React.createElement("p", {className: "step-text"}, "Pick a city from hundreds of cities around the world")
					), 
					React.createElement("div", {className: "col-md-3 step"}, 
						React.createElement("i", {className: "fa fa-tags fa-3x"}), 
						React.createElement("p", {className: "step-title"}, "2. Play with tags"), 
						React.createElement("p", {className: "step-text"}, "Add and remove tags as you filter hostels")
					), 
					React.createElement("div", {className: "col-md-3 step"}, 
						React.createElement("i", {className: "fa fa-search fa-3x"}), 
						React.createElement("p", {className: "step-title"}, "3. Browse hostels"), 
						React.createElement("p", {className: "step-text"}, "Hostels where the tags are more relevant will be displayed first")
					), 
					React.createElement("div", {className: "col-md-3 step"}, 
						React.createElement("i", {className: "fa fa-bookmark fa-3x"}), 
						React.createElement("p", {className: "step-title"}, "4. Book your hostel"), 
						React.createElement("p", {className: "step-text"}, "Finish your booking with HostelWorld")
					)
				), 

				React.createElement("div", {className: "features-container"}, 
					React.createElement("p", {id: "features", className: "title"}, "Features"), 
					React.createElement("div", {className: "row no-horizontal-margins row-container"}, 
						React.createElement("div", {className: "col-md-3 step"}, 
							React.createElement("i", {className: "fa fa-thumbs-o-up fa-3x"}), 
							React.createElement("p", {className: "step-title"}, "Easy"), 
							React.createElement("p", {className: "step-text"}, "Only pick a city and some tags")
						), 
						React.createElement("div", {className: "col-md-3 step"}, 
							React.createElement("i", {className: "fa fa-magic fa-3x"}), 
							React.createElement("p", {className: "step-title"}, "Wise"), 
							React.createElement("p", {className: "step-text"}, "The application knows the most relevant tags for each hostel")
						), 
						React.createElement("div", {className: "col-md-3 step"}, 
							React.createElement("i", {className: "fa fa-sort fa-3x"}), 
							React.createElement("p", {className: "step-title"}, "Smart"), 
							React.createElement("p", {className: "step-text"}, "The application knows how to sort the hostels, based on tags")
						), 
						React.createElement("div", {className: "col-md-3 step"}, 
							React.createElement("i", {className: "fa fa-rocket fa-3x"}), 
							React.createElement("p", {className: "step-title"}, "Interactive"), 
							React.createElement("p", {className: "step-text"}, "Play with tags as you refine your search")
						)
					)
				)
			)
		);
	}
});

var HIW = React.createClass({displayName: "HIW",
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(Header, null), 
				React.createElement(Menu, null), 
				React.createElement(Content, null), 
				React.createElement(TripTailorFooter, null)
			)
		);
	}
});

React.render(React.createElement(HIW, null), document.body);
