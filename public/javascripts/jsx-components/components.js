var BASEURL    = jsRoutes.controllers.ApplicationController.index().absoluteURL();
var SEARCHURL  = jsRoutes.controllers.SearchController.search().absoluteURL();
var TIMEOUT    = 200;

var AutoCompleteContainerMixin = {
  updateLocationValue: function(value) {
    this.setState({location: value});
  },
  updateQueryValue: function(value) {
    this.setState({query: value});
  },
  updateDates: function(dateFrom, dateTo) {
    this.setState({dateFrom: dateFrom, dateTo: dateTo});
  },
  addTag: function(value) {
    var tags = this.state.tags.slice(0, this.state.tags.length);
    tags.push(value);
    this.setState({tags: tags});
    return tags;
  },
  removeTag: function() {
    var tags = this.state.tags.slice(0, this.state.tags.length - 1);
    this.setState({tags: tags});
    return tags;
  },
  removeSpecificTag: function(i) {
    var tags = this.state.tags.slice(0, i).concat(this.state.tags.slice(i + 1, this.state.tags.length));
    this.setState({tags: tags});
    return tags;
  }
};

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

var AutoCompleteInputMixin = {
  mixins: [AutoCompleteMixin],
  elementClick: function(elementValue) {
    this.props.updateValue(elementValue);
    this.setState({hints: [], selectedItem: -1});
  },
  handleKeyUp: function(e) {
    if(e.keyCode == 27) {
      this.props.updateValue(this.state.hints[this.state.selectedItem]);
      this.setState({hints: [], selectedItem: -1});
    }
    else if(e.keyCode == 13) {
      if(this.state.selectedItem >= 0) {
        this.props.updateValue(this.state.hints[this.state.selectedItem]);
        this.setState({hints: [], selectedItem: -1});
      }
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
  }
};

var AutoCompleteTagsMixin = {
  mixins: [AutoCompleteMixin],
  componentDidUpdate: function() {
    var input = React.findDOMNode(this.refs.query);
    if($(input).width() < 36)
      input.setAttribute("readonly", true);
    else
      input.removeAttribute("readonly");

    var size = 30;
    for(var i = 0; i < this.props.tags.length; i++)
      size += $(React.findDOMNode(this.refs["tag-" + i])).width() + 20;
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
    }
    else if(e.keyCode == 32) {
      if(this.props.value.trim().length > 0)
        this.props.addTag(this.props.value.replace(/\s+/g, '').toLowerCase());
      this.props.updateValue("");
    }
  },
  handleKeyDown: function(e) {
    if(e.keyCode == 40 && this.state.selectedItem < this.state.hints.length - 1) {
      this.setState({selectedItem: this.state.selectedItem + 1});
    }
    else if(e.keyCode == 38 && this.state.selectedItem > 0) {
      this.setState({selectedItem: this.state.selectedItem - 1});
    }
    else if(e.keyCode == 9) {
      e.preventDefault();
      if(this.state.selectedItem >= 0) {
        this.props.addTag(this.state.hints[this.state.selectedItem]);
        this.setState({hints: [], selectedItem: -1});
      }
      else if(this.props.value != "")
        this.props.addTag(this.props.value.toLowerCase());
      this.props.updateValue("");
    }
    else if(e.keyCode == 8 && this.props.value == "") {
      this.props.removeTag();
    }
  }
};

var DatesMixin = {
  componentDidMount: function() {
    var fromInput = $(React.findDOMNode(this.refs.dateFrom));
    var toInput = $(React.findDOMNode(this.refs.dateTo));

    fromInput.datepicker({
      dateFormat: "dd M yy",
      onSelect: function(date, inst) {
        var fromDate = new Date(date);
        var toDate = new Date(toInput.datepicker("getDate"));
        if(fromDate >= toDate) {
          toDate = new Date(fromDate.getTime());
          toDate.setDate(toDate.getDate() + 1);
          toInput.datepicker("setDate", toDate);
        }

        var auxDate = new Date(fromDate.getTime());
        auxDate.setDate(auxDate.getDate() + 1);
        toInput.datepicker("option", "minDate", auxDate);

        this.updateDates(getStringDate(fromDate), getStringDate(toDate));
      }.bind(this)
    });
    toInput.datepicker({
      dateFormat: "dd M yy",
      onSelect: function(date, inst) {
        var fromDate = new Date(fromInput.datepicker("getDate"));
        var toDate = new Date(date);
        this.updateDates(getStringDate(fromDate), getStringDate(toDate));
      }.bind(this)
    });

    var dateFrom = new Date(this.props.dateFrom + " 0:0:0");
    fromInput.datepicker("setDate", dateFrom);
    toInput.datepicker("setDate", new Date(this.props.dateTo + " 0:0:0"));

    var dateAux = new Date(dateFrom.getTime());
    dateAux.setDate(dateAux.getDate() + 1);
    toInput.datepicker("option", "minDate", dateAux);
  }
};

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
  render: function() {
    return (
      <p className={this.props.selectedItem == this.props.index ? "autocomplete-element selected" : "autocomplete-element"} onClick={this.handleClick}>{this.props.value}</p>
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

var TripTailorHowItWorks = React.createClass({
  render: function() {
    return (
      <div className="how-it-works-container">
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
            <p className="step-text">Tags are keywords that people mentioned a lot in a positive context</p>
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
      </div>
    );
  }
});
