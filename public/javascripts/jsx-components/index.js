var Header = React.createClass({
  render: function() {
    return (
      <div className="jumbotron">
        <div className="container-fluid">

          <div className="row">
            <div className="col-md-10 col-md-offset-1 text-center">
              <h1 className="header">Looking for a hostel?</h1>
              <p className="subheader">TripTailor helps you find hostels by analysing reviews for you</p>
            </div>
          </div>

          <AutoCompleteSearch {...this.props} />

        </div>
      </div>
    );
  }
});

var Content = React.createClass({
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
      <div className="container-fluid">
        <div className="row tips-header-container">
          <div className="col-md-10 col-md-offset-1 text-center">
            <h2 className="tips-header">Popular Searches</h2>
            <p className="tips-subheader">Tips for your next trip</p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <a id="istanbulLink" href={SEARCHURL + "?location=Istanbul,Turkey&tags=location-view-terrace&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo} className="tip-a">
              <div className="tip-big">
                <div className="tip-content-container">
                  <div className="tip-content text-center">
                    <h3>Istanbul, Turkey</h3>
                    <p>Location, View & Terrace</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <div className="col-md-4">
            <div className="tip bangkok">
              <a id="bangkokLink" href={SEARCHURL + "?location=Bangkok,Thailand&tags=clean-modern-spacious&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo} className="tip-a">
                <div className="tip-content-container">
                  <div className="tip-content text-center">
                    <h3>Bangkok, Thailand</h3>
                    <p>Clean, Modern & Spacious</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="row bottom-tips">
          <div className="col-md-4">
            <div className="tip amsterdam">
              <a id="amsterdamLink" href={SEARCHURL + "?location=Amsterdam,Netherlands&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo} className="tip-a">
                <div className="tip-content-container">
                  <div className="tip-content text-center">
                    <h3>Amsterdam, Netherlands</h3>
                    <p>popular destination</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="tip rio">
              <a id="rioLink" href={SEARCHURL + "?location=Rio-de-Janeiro,Brazil&tags=fun-party-people&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo} className="tip-a">
                <div className="tip-content-container">
                  <div className="tip-content text-center">
                    <h3>Rio de Janeiro, Brazil</h3>
                    <p>Fun, People & Party</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="tip ny">
              <a id="nyLink" href={SEARCHURL + "?location=New-York,USA&tags=breakfast-bar-artwork&date-from=" + this.props.dateFrom + "&date-to=" + this.props.dateTo} className="tip-a">
                <div className="tip-content-container">
                  <div className="tip-content text-center">
                    <h3>New York, USA</h3>
                    <p>Breakfast, Bar & Artwork</p>
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
      <div>
        <Header {...this.props} />
        <TripTailorHowItWorks />
        <Content {...this.props} />
      </div>
    );
  }
});

var AutoCompleteSearch = React.createClass({
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
      <div className="row">
        <div className="col-md-10 col-md-offset-1">
          <div className="row autocomplete-row">
            <div className="col-md-3 autocomplete-col border-right">
              <AutoCompleteInput url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations="} value={this.state.location} updateValue={this.updateLocationValue} submit={this.enterSubmit} />
            </div>
            <div className="col-md-4 autocomplete-col border-right">
              <AutoCompleteTags url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags="} value={this.state.query} updateValue={this.updateQueryValue} submit={this.enterSubmit} tags={this.state.tags} addTag={this.addTag} removeTag={this.removeTag} removeSpecificTag={this.removeSpecificTag} />
            </div>
            <div className="col-md-4">
              <div className="row">
               <div className="col-xs-6 autocomplete-col xs-border-right">
                 <input type="text" ref="dateFrom" placeholder="Check in" className="triptailor-input inline-left-picker" readOnly />
               </div>
               <div className="col-xs-6 autocomplete-col">
                 <input type="text" ref="dateTo" placeholder="Check out" className="triptailor-input inline-right-picker" readOnly />
               </div>
              </div>
            </div>
            <div className="col-md-1 autocomplete-a-col">
              <a ref="submit" className="submit" href="" onClick={this.submit}>Search</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var AutoCompleteInput = React.createClass({
  mixins: [AutoCompleteInputMixin],
  indexHandleKeyUp: function(e) {
    this.handleKeyUp(e);
    if(e.keyCode == 13 && this.state.selectedItem < 0)
      this.props.submit();
  },
  render: function() {
    return (
      <div>
        <input ref="query" type="text" className="triptailor-input inline-input-left" placeholder="Pick a city" autoComplete="off" value={this.props.value} onChange={this.handleValueChanged} onKeyUp={this.indexHandleKeyUp} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />
        {this.state.hints.length > 0 ? <TripTailorAutoCompleteResults hints={this.state.hints} selectedItem={this.state.selectedItem} elementClick={this.elementClick} elementHover={this.updateSelectedItem} /> : ''}
      </div>
    );
  }
});

var AutoCompleteTags = React.createClass({
  mixins: [AutoCompleteTagsMixin],
  indexHandleKeyUp: function(e) {
    this.handleKeyUp(e);
    if(e.keyCode == 13 && this.state.selectedItem < 0)
      this.props.submit();
  },
  render: function() {
    var tags = $.map(this.props.tags, function(value, i) {
      return (
        <TripTailorInputTag ref={"tag-" + i} key={i} index={i} value={value} removeSpecificTag={this.props.removeSpecificTag} />
      );
    }.bind(this));

    return (
      <div ref="tags-container" className="autocomplete-tags-container inline-input-tags">
        <div className="tag-search-container">
          {tags}
          <div className="tag-search-input">
            <input ref="query" type="text" className="triptailor-input input-tags" placeholder={this.props.tags.length == 0 ? "Write some tags" : ""} autoComplete="off" value={this.props.value} onChange={this.handleValueChanged} onKeyUp={this.indexHandleKeyUp} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />
          </div>
        </div>
        {this.state.hints.length > 0 ? <TripTailorAutoCompleteResults hints={this.state.hints} selectedItem={this.state.selectedItem} elementClick={this.elementClick} elementHover={this.updateSelectedItem} /> : ''}
      </div>
    );
  }
});

React.render(<Index />, document.getElementById("content"));
