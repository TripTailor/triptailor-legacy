var Header = React.createClass({displayName: "Header",
  render: function() {
    return (
      React.createElement("div", {className: "jumbotron"}, 
        React.createElement("div", {className: "container-fluid"}, 

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
      React.createElement("div", {className: "container-fluid"}, 
        React.createElement(TripTailorHowItWorks, null), 
        React.createElement(Features, null)
      )
    );
  }
});

var Features = React.createClass({displayName: "Features",
  render: function() {
    return(
      React.createElement("div", {className: "features-container"}, 
        React.createElement("p", {id: "features", className: "title"}, "Features"), 
        React.createElement("div", {className: "row no-horizontal-margins"}, 
          React.createElement("div", {className: "col-md-3 step"}, 
            React.createElement("i", {className: "fa fa-expand fa-3x"}), 
            React.createElement("p", {className: "step-title"}, "Exhaustive"), 
            React.createElement("p", {className: "step-text"}, "We browsed the web to find what people were saying about almost every hostel in the world")
          ), 
          React.createElement("div", {className: "col-md-3 step"}, 
            React.createElement("i", {className: "fa fa-magic fa-3x"}), 
            React.createElement("p", {className: "step-title"}, "Smart"), 
            React.createElement("p", {className: "step-text"}, "We made a Natural Language Processing analysis on that information, to get the relevant keywords")
          ), 
          React.createElement("div", {className: "col-md-3 step"}, 
            React.createElement("i", {className: "fa fa-arrows fa-3x"}), 
            React.createElement("p", {className: "step-title"}, "Contextual"), 
            React.createElement("p", {className: "step-text"}, "Hostel tags are keywords that people mentioned a lot, in a positive context")
          ), 
          React.createElement("div", {className: "col-md-3 step"}, 
            React.createElement("i", {className: "fa fa-dot-circle-o fa-3x"}), 
            React.createElement("p", {className: "step-title"}, "Intuitive"), 
            React.createElement("p", {className: "step-text"}, "We sort the hostels for each search you make, to give you the most relevant hostels")
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
        React.createElement(Content, null)
      )
    );
  }
});

React.render(React.createElement(HIW, null), document.getElementById("content"));
