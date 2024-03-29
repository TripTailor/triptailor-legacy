var Header = React.createClass({displayName: "Header",
  render: function() {
    return (
      React.createElement("div", {className: "jumbotron"}, 
        React.createElement("div", {className: "container-fluid"}, 

          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-md-10 col-md-offset-1 text-center"}, 
              React.createElement("h1", {className: "header"}, "Looking for a hostel?"), 
              React.createElement("p", {className: "subheader"}, "TripTailor helps you find hostels by analysing reviews for you")
            )
          ), 

          React.createElement(AutoCompleteSearch, React.__spread({},  this.props))

        )
      )
    );
  }
});

var Content = React.createClass({displayName: "Content",
  componentDidMount: function() {
    mixpanel.track_links("#istanbulLink", "Index Tip Clicked", {
      city: "Istanbul"
    });
    mixpanel.track_links("#bangkokLink", "Index Tip Clicked", {
      city: "Bangkok"
    });
    mixpanel.track_links("#amsterdamLink", "Index Tip Clicked", {
      city: "Amsterdam"
    });
    mixpanel.track_links("#rioLink", "Index Tip Clicked", {
      city: "Rio de Janeiro"
    });
    mixpanel.track_links("#nyLink", "Index Tip Clicked", {
      city: "New York"
    });
  },
  render: function() {
    return (
      React.createElement("div", {className: "container-fluid"}, 
        React.createElement("div", {className: "row tips-header-container"}, 
          React.createElement("div", {className: "col-md-10 col-md-offset-1 text-center"}, 
            React.createElement("h2", {className: "tips-header"}, "Popular Searches"), 
            React.createElement("p", {className: "tips-subheader"}, "Tips for your next trip")
          )
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-8"}, 
            React.createElement("a", {id: "istanbulLink", href: SEARCHURL + "?location=Istanbul,Turkey&tags=location-view-terrace&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo, className: "tip-a"}, 
              React.createElement("div", {className: "tip-big"}, 
                React.createElement("div", {className: "tip-content-container"}, 
                  React.createElement("div", {className: "tip-content text-center"}, 
                    React.createElement("h3", null, "Istanbul, Turkey"), 
                    React.createElement("p", null, "Location, View & Terrace")
                  )
                )
              )
            )
          ), 
          React.createElement("div", {className: "col-md-4"}, 
            React.createElement("div", {className: "tip bangkok"}, 
              React.createElement("a", {id: "bangkokLink", href: SEARCHURL + "?location=Bangkok,Thailand&tags=clean-modern-spacious&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo, className: "tip-a"}, 
                React.createElement("div", {className: "tip-content-container"}, 
                  React.createElement("div", {className: "tip-content text-center"}, 
                    React.createElement("h3", null, "Bangkok, Thailand"), 
                    React.createElement("p", null, "Clean, Modern & Spacious")
                  )
                )
              )
            )
          )
        ), 

        React.createElement("div", {className: "row bottom-tips"}, 
          React.createElement("div", {className: "col-md-4"}, 
            React.createElement("div", {className: "tip amsterdam"}, 
              React.createElement("a", {id: "amsterdamLink", href: SEARCHURL + "?location=Amsterdam,Netherlands&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo, className: "tip-a"}, 
                React.createElement("div", {className: "tip-content-container"}, 
                  React.createElement("div", {className: "tip-content text-center"}, 
                    React.createElement("h3", null, "Amsterdam, Netherlands"), 
                    React.createElement("p", null, "popular destination")
                  )
                )
              )
            )
          ), 
          React.createElement("div", {className: "col-md-4"}, 
            React.createElement("div", {className: "tip rio"}, 
              React.createElement("a", {id: "rioLink", href: SEARCHURL + "?location=Rio-de-Janeiro,Brazil&tags=fun-party-people&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo, className: "tip-a"}, 
                React.createElement("div", {className: "tip-content-container"}, 
                  React.createElement("div", {className: "tip-content text-center"}, 
                    React.createElement("h3", null, "Rio de Janeiro, Brazil"), 
                    React.createElement("p", null, "Fun, People & Party")
                  )
                )
              )
            )
          ), 
          React.createElement("div", {className: "col-md-4"}, 
            React.createElement("div", {className: "tip ny"}, 
              React.createElement("a", {id: "nyLink", href: SEARCHURL + "?location=New-York,USA&tags=breakfast-bar-artwork&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo, className: "tip-a"}, 
                React.createElement("div", {className: "tip-content-container"}, 
                  React.createElement("div", {className: "tip-content text-center"}, 
                    React.createElement("h3", null, "New York, USA"), 
                    React.createElement("p", null, "Breakfast, Bar & Artwork")
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
  getDefaultProps: function() {
    var dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() + 1);
    var dateTo = new Date();
    dateTo.setDate(dateTo.getDate() + 4);

    dateFromStr = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
    dateToStr = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
    return {dateFrom: dateFromStr, dateTo: dateToStr};
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Header, React.__spread({},  this.props)), 
        React.createElement(TripTailorHowItWorks, null), 
        React.createElement(Content, React.__spread({},  this.props))
      )
    );
  }
});

var AutoCompleteSearch = React.createClass({displayName: "AutoCompleteSearch",
  mixins: [AutoCompleteContainerMixin, DatesMixin],
  getInitialState: function() {
    return {location: '', query: '', tags: [], dateFrom: this.props.dateFrom, dateTo: this.props.dateTo};
  },
  submit: function(e) {
    if(this.state.location == '') {
      e.preventDefault();
      return;
    }
    var url = SEARCHURL + "?location=" + this.state.location.replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
    if(this.state.tags.length > 0)
      url += "&tags=" + getStringTags(this.state.tags);
    url += "&date-from=" + this.state.dateFrom + "&date-to=" + this.state.dateTo;
    React.findDOMNode(this.refs.submit).href = url + adVariables();
  },
  enterSubmit: function() {
    React.findDOMNode(this.refs.submit).click();
  },
  render: function() {
    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-10 col-md-offset-1"}, 
          React.createElement("div", {className: "row autocomplete-row"}, 
            React.createElement("div", {className: "col-md-3 autocomplete-col border-right"}, 
              React.createElement(AutoCompleteInput, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations=", value: this.state.location, updateValue: this.updateLocationValue, submit: this.enterSubmit})
            ), 
            React.createElement("div", {className: "col-md-4 autocomplete-col border-right"}, 
              React.createElement(AutoCompleteTags, {url: jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags=", value: this.state.query, updateValue: this.updateQueryValue, submit: this.enterSubmit, tags: this.state.tags, addTag: this.addTag, removeTag: this.removeTag, removeSpecificTag: this.removeSpecificTag})
            ), 
            React.createElement("div", {className: "col-md-4"}, 
              React.createElement("div", {className: "row"}, 
               React.createElement("div", {className: "col-xs-6 autocomplete-col xs-border-right"}, 
                 React.createElement("input", {type: "text", ref: "dateFrom", placeholder: "Check in", className: "triptailor-input inline-left-picker", readOnly: true})
               ), 
               React.createElement("div", {className: "col-xs-6 autocomplete-col"}, 
                 React.createElement("input", {type: "text", ref: "dateTo", placeholder: "Check out", className: "triptailor-input inline-right-picker", readOnly: true})
               )
              )
            ), 
            React.createElement("div", {className: "col-md-1 autocomplete-a-col"}, 
              React.createElement("a", {ref: "submit", className: "submit", href: "", onClick: this.submit}, "Search")
            )
          )
        )
      )
    );
  }
});

var AutoCompleteInput = React.createClass({displayName: "AutoCompleteInput",
  mixins: [AutoCompleteInputMixin],
  indexHandleKeyUp: function(e) {
    this.handleKeyUp(e);
    if(e.keyCode == 13 && this.state.selectedItem < 0)
      this.props.submit();
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("input", {ref: "query", type: "text", className: "triptailor-input inline-input-left", placeholder: "Pick a city", autoComplete: "off", value: this.props.value, onChange: this.handleValueChanged, onKeyUp: this.indexHandleKeyUp, onBlur: this.handleBlur, onKeyDown: this.handleKeyDown}), 
        this.state.hints.length > 0 ? React.createElement(TripTailorAutoCompleteResults, {hints: this.state.hints, selectedItem: this.state.selectedItem, elementClick: this.elementClick, elementHover: this.updateSelectedItem}) : ''
      )
    );
  }
});

var AutoCompleteTags = React.createClass({displayName: "AutoCompleteTags",
  mixins: [AutoCompleteTagsMixin],
  indexHandleKeyUp: function(e) {
    this.handleKeyUp(e);
    if(e.keyCode == 13 && this.state.selectedItem < 0)
      this.props.submit();
  },
  render: function() {
    var tags = $.map(this.props.tags, function(value, i) {
      return (
        React.createElement(TripTailorInputTag, {ref: "tag-" + i, key: i, index: i, value: value, removeSpecificTag: this.props.removeSpecificTag})
      );
    }.bind(this));

    return (
      React.createElement("div", {ref: "tags-container", className: "autocomplete-tags-container inline-input-tags"}, 
        React.createElement("div", {className: "tag-search-container"}, 
          tags, 
          React.createElement("div", {className: "tag-search-input"}, 
            React.createElement("input", {ref: "query", type: "text", className: "triptailor-input input-tags", placeholder: this.props.tags.length == 0 ? "Write some tags" : "", autoComplete: "off", value: this.props.value, onChange: this.handleValueChanged, onKeyUp: this.indexHandleKeyUp, onBlur: this.handleBlur, onKeyDown: this.handleKeyDown})
          )
        ), 
        this.state.hints.length > 0 ? React.createElement(TripTailorAutoCompleteResults, {hints: this.state.hints, selectedItem: this.state.selectedItem, elementClick: this.elementClick, elementHover: this.updateSelectedItem}) : ''
      )
    );
  }
});

React.render(React.createElement(Index, null), document.getElementById("content"));
