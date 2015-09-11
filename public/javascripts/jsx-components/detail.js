var Header = React.createClass({
  render: function() {
    return (
      <div className="container-fluid header">
        <div className="row">
          <div className="col-md-9">
            <p className="header-title"><strong>{hostel.name}</strong></p>
            {/* <p className="hostel-address">Street and number, Neighborhood, City, Country</p> */}
          </div>
          <div className="col-md-3">
            <p className="header-title">{/* <strong>$Price<span className="currency">USD</span></strong> */}{hostel.url != null ? <span className="book-span"><a href={hostel.url} target="_blank" className="book-link">Book</a></span> : ""}</p>
          </div>
        </div>
      </div>
    );
  }
});

var Description = React.createClass({
  render: function() {
    return (
      <div className="description">
        <p className="description-label"><strong>Description</strong></p>
        <p>{hostel.description}</p>
      </div>
    );
  }
});

var Photos = React.createClass({
  getInitialState: function() {
    var photos = hostel.image.split(",");
    if(photos[0] == "")
      photos = [];
    return {photos: photos, mainPhoto: photos.length > 0 ? 0 : -1, more: false};
  },
  selectPhoto: function(i) {
    this.setState({mainPhoto: i});
  },
  selectRight: function() {
    var i = this.state.mainPhoto;
    i++;
    if(i >= this.state.photos.length)
      i = 0;
    this.setState({mainPhoto: i});
  },
  selectLeft: function() {
    var i = this.state.mainPhoto;
    i--;
    if(i < 0)
      i = this.state.photos.length - 1;
    this.setState({mainPhoto: i});
  },
  showMore: function() {
    this.setState({more: true});
  },
  showLess: function() {
    this.setState({more: false});
  },
  render: function() {
    return (
      <div>
        <MainPhoto photos={this.state.photos} mainPhoto={this.state.mainPhoto} selectRight={this.selectRight} selectLeft={this.selectLeft} />
        <OtherPhotos photos={this.state.photos} more={this.state.more} selectPhoto={this.selectPhoto} showMore={this.showMore} showLess={this.showLess} />
      </div>
    );
  }
});

var MainPhoto = React.createClass({
  render: function() {
    return (
      this.props.mainPhoto >= 0 ?
        <div className="main-photo" style={{background: "url(" + this.props.photos[this.props.mainPhoto] + ") no-repeat center center", backgroundSize: "contain"}}>
          <div className="photo-left-arrow"><i className="fa fa-arrow-circle-left fa-3x" onClick={this.props.selectLeft}></i></div>
          <div className="photo-right-arrow"><i className="fa fa-arrow-circle-right fa-3x" onClick={this.props.selectRight}></i></div>
        </div>
      : <div className="main-photo"></div>
    );
  }
});

var OtherPhotos = React.createClass({
  render: function() {
    var photos = [];
    for(var i = 0; i < this.props.photos.length && (this.props.more || i < 4); i++) {
        photos.push(<div key={i} className="other-photo" style={{background: "url(" + this.props.photos[i] + ") no-repeat center center", backgroundSize: "cover"}} onClick={this.props.selectPhoto.bind(this, i)}></div>);
    }
    if(this.props.photos.length > 0 && !this.props.more)
      photos.push(<div className="other-photo more-photos" onClick={this.props.showMore}>View More</div>);
    else if(this.props.photos.length > 0)
      photos.push(<div className="other-photo more-photos" onClick={this.props.showLess}>View Less</div>);
    return (
      <div>
        {photos}
      </div>
    );
  }
});

var Tags = React.createClass({
  render: function() {
    var tags = $.map(this.props.tags, function(tag, i) {
      return (
        <Tag key={i} index={i} name={tag.name} type={tag.type} toggleTag={this.props.toggleTag} />
      );
    }.bind(this));
    return (
      <div className="tags">
        <p className="tags-label"><strong>Tags</strong></p>
        <div className="tags">
          {tags}
        </div>
      </div>
    );
  }
});

var Tag = React.createClass({
  handleClick: function() {
    this.props.toggleTag(this.props.index);
  },
  render: function() {
    return (
      <div className={this.props.type == 0 ? "tag tag-selected" : "tag tag-unselected"} onClick={this.handleClick}>{this.props.name}</div>
    );
  }
});

var Reviews = React.createClass({
  getInitialState: function() {
    return {reviews: []}
  },
  componentWillMount: function() {
    this.getReviews();
  },
  getReviews: function() {
    $.ajax({
      url: "../../assets/test/reviews.json",
      dataType: "json",
      type: "GET",
      success: function(data) {
        this.setState({reviews: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("Reviews test", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var reviews = [];
    var selectedString = "";
    var selectedTags = $.map(this.props.tags, function(tag, i) {
      if(tag.type == 0) {
        selectedString += tag.name + " ";
        return tag.name;
      }
    });
    $.each(this.state.reviews, function(i, review) {
      if(selectedTags.length == 0)
        reviews.push(<Review key={i} reviewer={review.reviewer} date={review.date} review={review.review} />);
      else
        for(var j = 0; j <  selectedTags.length; j++) {
          if(review.tags.indexOf(selectedTags[j]) != -1) {
            reviews.push(<Review key={i} reviewer={review.reviewer} date={review.date} review={review.review} />);
            break;
          }
        }
    });
    return (
      <div className="reviews">
        <p className="reviews-label"><strong>Reviews</strong></p>
        <p className="reviews-copy">Showing <strong>{reviews.length}</strong> (of {this.state.reviews.length} total reviews) {selectedTags.length > 0 ? <span>related with <strong>{selectedString}</strong></span> : ""}</p>
        <div>
          {reviews}
        </div>
      </div>
    );
  }
});

var Review = React.createClass({
  render: function() {
    return (
      <div className="review">
        <p className="review-label"><strong>{this.props.reviewer}</strong> (<i>{this.props.date}</i>)</p>
        <p>{this.props.review}</p>
      </div>
    );
  }
});

var ReviewsSection = React.createClass({
  getInitialState: function() {
    return {tags: hostel.tags};
  },
  toggleTag: function(i) {
    var tags = this.state.tags.slice();
    tags[i].type = 1 - tags[i].type;
    this.setState(tags);
  },
  render: function() {
    return (
      <div>
        <Tags tags={this.state.tags} toggleTag={this.toggleTag} />
        {/* <Reviews tags={this.state.tags} /> */}
      </div>
    );
  }
});

var Content = React.createClass({
  render: function() {
    return (
      <div className="container-fluid content">
        <div className="row">
          <div className="col-md-9">
            <Photos />
            <ReviewsSection />
          </div>
          <div className="col-md-3">
            <Description />
          </div>
        </div>
      </div>
    );
  }
});

var Detail = React.createClass({
  render: function() {
    return (
      <div>
        <Header />
        <Content />
      </div>
    );
  }
});

React.render(<Detail />, document.getElementById("content"));
