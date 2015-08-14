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

          <AutoCompleteSearch />

        </div>
      </div>
    );
  }
});

var Content = React.createClass({
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
  mixins: [AutoCompleteContainerMixin],
  getInitialState: function() {
    return {location: '', query: '', tags: []};
  },
  submit: function(e) {
    if(this.state.location == '') {
      e.preventDefault();
      return;
    }
    var url = SEARCHURL + "?location=" + this.state.location.replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
    if(this.state.tags.length > 0)
      url += "&tags=" + getStringTags(this.state.tags);
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
            <div className="col-md-5 autocomplete-col-left">
              <AutoCompleteInput url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations="} value={this.state.location} updateValue={this.updateLocationValue} submit={this.enterSubmit} />
            </div>
            <div className="col-md-5 autocomplete-col-center">
              <AutoCompleteTags url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags="} value={this.state.query} updateValue={this.updateQueryValue} submit={this.enterSubmit} tags={this.state.tags} addTag={this.addTag} removeTag={this.removeTag} removeSpecificTag={this.removeSpecificTag} />
            </div>
            <div className="col-md-2 autocomplete-a-col">
              <a ref="submit" className="submit" href="" onClick={this.submit}>Search</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var AutoCompleteInput = React.createClass({
  mixins: [AutoCompleteMixin, AutoCompleteInputMixin],
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
      <div ref="tags-container" className="autocomplete-tags-container">
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
