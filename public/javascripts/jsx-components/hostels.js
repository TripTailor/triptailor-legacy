var HOSTELSTODISPLAY = 10;

var Hostels = React.createClass({
  mixins: [AutoCompleteContainerMixin],
  getInitialState: function() {
    return {location: city, query: '', tags: this.getArrayTags(getQueryValue("tags")), results: [], searchId: -1};
  },
  componentWillMount: function() {
    this.getResults(this.state.location, this.state.tags);
  },
  hostelsAddTag: function(value) {
    this.getResults(this.state.location, this.addTag(value));
  },
  hostelsRemoveTag: function() {
    this.getResults(this.state.location, this.removeTag());
  },
  hostelsRemoveSpecificTag: function(i) {
    this.getResults(this.state.location, this.removeSpecificTag(i));
  },
  getResults: function(location, tags) {
    this.setState({searchId: -1});
    var route;
    location = location.replace(/[\/%]/g,"").replace(", ", ",").replace(/-/g, "%21").replace(/ /g, "-");
    if (tags.length == 0)
      route = jsRoutes.controllers.SearchController.displayAll(location);
    else
      route = jsRoutes.controllers.SearchController.classify(location, getStringTags(tags));
    $.ajax({
      url: route.absoluteURL(),
      dataType: 'json',
      type: route.type,
      success: function(data) {
        this.setState({results: data.classifiedHostels, searchId: data.searchID});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(route.absoluteURL(), status, err.toString());
      }.bind(this)
    });
  },
  getArrayTags: function(tagsString) {
    var tags = [];
    var split = tagsString.split("-");
    for(var i in split) {
      if(split[i] != '') {
        tags.push(split[i]);
      }
    }
    return tags;
  },
  render: function() {
    return (
      <div>
        <SearchHeader location={this.state.location} query={this.state.query} tags={this.state.tags} updateLocationValue={this.updateLocationValue} updateQueryValue={this.updateQueryValue} addTag={this.hostelsAddTag} removeTag={this.hostelsRemoveTag} removeSpecificTag={this.hostelsRemoveSpecificTag} getResults={this.getResults} />
        <Content results={this.state.results} searchId={this.state.searchId} location={this.state.location} tags={this.state.tags} alsoTags={this.state.alsoTags} addTag={this.hostelsAddTag} />
      </div>
    );
  }
});

var SearchHeader = React.createClass({
  render: function() {
    return (
      <div className="container-fluid header">
        <p className="header-label" ><strong>Location</strong></p>
        <AutoCompleteInput url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?locations="} value={this.props.location} updateValue={this.props.updateLocationValue} getResults={this.props.getResults} tags={this.props.tags} />
        <p className="header-label" ><strong>Tags</strong></p>
        <AutoCompleteTags url={jsRoutes.controllers.HintsController.hostelHints().absoluteURL() + "?tags="} value={this.props.query} updateValue={this.props.updateQueryValue} tags={this.props.tags} addTag={this.props.addTag} removeTag={this.props.removeTag} removeSpecificTag={this.props.removeSpecificTag} />
      </div>
    );
  }
});

var AutoCompleteInput = React.createClass({
  mixins: [AutoCompleteMixin, AutoCompleteInputMixin],
  hostelsElementClick: function(elementValue) {
    this.elementClick(elementValue);
    this.props.getResults(elementValue, this.props.tags);
  },
  hostelsHandleKeyUp: function(e) {
    this.handleKeyUp(e);
    if(e.keyCode == 13 && this.state.selectedItem >= 0)
      this.props.getResults(this.state.hints[this.state.selectedItem], this.props.tags);
  },
  hostelsHandleKeyDown: function(e) {
    this.handleKeyDown(e);
    if(e.keyCode == 9 && this.state.selectedItem >= 0) {
      e.preventDefault();
      this.props.getResults(this.state.hints[this.state.selectedItem], this.props.tags);
    }
  },
  render: function() {
    return (
      <div>
        <input ref="query" type="text" className="triptailor-input location-input" placeholder="Pick a city" autoComplete="off" value={this.props.value} onChange={this.handleValueChanged} onKeyUp={this.hostelsHandleKeyUp} onBlur={this.handleBlur} onKeyDown={this.hostelsHandleKeyDown} />
        {this.state.hints.length > 0 ? <TripTailorAutoCompleteResults hints={this.state.hints} selectedItem={this.state.selectedItem} elementClick={this.hostelsElementClick} elementHover={this.updateSelectedItem} /> : ''}
      </div>
    );
  }
});

var AutoCompleteTags = React.createClass({
  mixins: [AutoCompleteTagsMixin],
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
            <input ref="query" type="text" className="triptailor-input input-tags" placeholder={this.props.tags.length == 0 ? "Write some tags" : ""} autoComplete="off" value={this.props.value} onChange={this.handleValueChanged} onKeyUp={this.handleKeyUp} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />
          </div>
        </div>
        {this.state.hints.length > 0 ? <TripTailorAutoCompleteResults hints={this.state.hints} selectedItem={this.state.selectedItem} elementClick={this.elementClick} elementHover={this.updateSelectedItem} /> : ''}
      </div>
    );
  }
});



var Content = React.createClass({
  render: function() {
    return (
      <div className="container-fluid content">
        <div className="row">
          <div className="col-md-3">
            <Filters {...this.props} />
          </div>
          <div className="col-md-9">
            {this.props.searchId >= 0 ? <NumberResults results={this.props.results.length} /> : <div className="spinner"><img src="../assets/images/spinner.gif" /></div>}
            {this.props.searchId >= 0 ? <ResultsGrid {...this.props} /> : ""}
          </div>
        </div>
      </div>
    );
  }
});

var NumberResults = React.createClass({
  render: function() {
    return (
      <p className="results-number">Matching results <strong>{this.props.results}</strong></p>
    );
  }
});

var ResultsGrid = React.createClass({
  getInitialState: function() {
    return {displayedResults: HOSTELSTODISPLAY};
  },
  displayMoreResults: function() {
    this.setState({displayedResults: this.state.displayedResults + HOSTELSTODISPLAY});
  },
  render: function() {
    var results = [];
    for(var i = 0; i < this.props.results.length && i < this.state.displayedResults; i++) {
      results.push(<Result key={i} result={this.props.results[i]} moreTags={this.state.more} showMoreTags={this.showMoreTags} showLessTags={this.showLessTags} searchId={this.props.searchId} tags={this.props.tags} />);
    };
    return (
      <div>
        {results}
        {this.props.results.length > this.state.displayedResults ? <button className="more-results" onClick={this.displayMoreResults}>Show more results</button> : ''}
      </div>
    );
  }
});

var Result = React.createClass({
  handleClick: function() {
    var route = jsRoutes.controllers.StatsController.saveHostelClick();
    $.ajax({
      url: route.absoluteURL(),
      type: route.type,
      data: { hostelId: this.props.result.id, searchId: this.props.searchId }
    }).fail( function(xhr, ts, e) {
      console.error(route.absoluteURL(), ts, e.toString())
    })
  },
  render: function() {
    var route = jsRoutes.controllers.SearchController.detail(this.props.result.name.replace(/ /g, "-"), getStringTags(this.props.tags));
    var tags = [];
    for(var i = 0; i < 8 && i < this.props.result.tags.length; i++) {
      tags.push(<Tag key={i} name={this.props.result.tags[i].name} type={this.props.result.tags[i].type} />);
    }
    return (
      <div className="result">
        <a href={route.absoluteURL()} className="result-a" onClick={this.handleClick}>
          <div className="row">
            <div className="col-xs-3">
              <div className="result-photo" style={this.props.result.images.length > 0 ? {background: "url(" + this.props.result.images[0] + ") no-repeat center center", backgroundSize: "contain"} : {}}></div>
            </div>
            <div className="col-xs-9">
              <div className="result-name">
                <div className="result-price">{this.props.result.price} USD</div>
                <strong>{this.props.result.name}</strong>
              </div>
              <div className="result-tags">
                {tags}
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }
});

var Tag = React.createClass({
  render: function() {
    return (
      <div className={this.props.type == 0 ? "tag tag-selected" : "tag tag-unselected"}>{this.props.name}</div>
    );
  }
});

var Filters = React.createClass({
  render: function() {
    return(
      <div>
        <AlsoTry location={this.props.location} tags={this.props.tags} alsoTags={this.props.alsoTags} addTag={this.props.addTag} /> 
        <TagsHint />
      </div>
    );
  }
});

var AlsoTry = React.createClass({
  getInitialState: function() {
    return {alsoTags: []};
  },
  componentWillMount: function() {
    this.getSuggestions();
  },
  removeSpecificAlsoTag: function(i) {
    this.setState({alsoTags: this.state.alsoTags.slice(0, i).concat(this.state.alsoTags.slice(i + 1, this.state.alsoTags.length))});
  },
  getSuggestions: function(location) {
    var route = jsRoutes.controllers.HintsController.tagSuggestions();
    $.ajax({
      url: route.absoluteURL() + "?location=" + this.props.location.replace(", ", ",") + (this.props.tags.length > 0 ? "&tags=" + getStringTags(this.props.tags) : ""),
      dataType: 'json',
      type: route.type,
      success: function(data) {
        this.setState({alsoTags: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(route.absoluteURL(), status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var tags = $.map(this.state.alsoTags, function(value, i) {
      return (
        <AlsoTryTag key={i} index={i} name={value} add={this.props.addTag} remove={this.removeSpecificAlsoTag} />
      );
    }.bind(this));

    return (
      <div className="filter">
        {tags.length > 0 ? <p className="filter-label"><strong>Also Try</strong></p> : <p className="filter-label">Try adding more tags yourself.</p>}
        {tags.length > 0 ? <div>
          {tags}
        </div> : ""}
      </div>
    );
  }
});

var TagsHint = React.createClass({
  render: function() {
    return (
      <div className="tags-hint filter">
        <p className="filter-label"><i className="fa fa-rocket fa-1x"></i><strong>Hint</strong></p>
        <div>Tags are keywords that people mentioned a lot in a positive context.</div>
      </div>
    );
  }
});

var AlsoTryTag = React.createClass({
  handleClick: function() {
    this.props.add(this.props.name);
    this.props.remove(this.props.index);
  },
  render: function() {
    return (
      <div className="tag tag-unselected tag-also" onClick={this.handleClick}>{this.props.name}</div>
    );
  }
});

React.render(<Hostels />, document.getElementById("content"));
