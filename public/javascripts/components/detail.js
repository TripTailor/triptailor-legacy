var Header = React.createClass({displayName: "Header",
  render: function() {
    return (
      React.createElement("div", {className: "container-fluid header"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-9"}, 
            React.createElement("p", {className: "header-title"}, React.createElement("strong", null, "Hostel Name")), 
            React.createElement("p", {className: "hostel-address"}, "Street and number, Neighborhood, City, Country")
          ), 
          React.createElement("div", {className: "col-md-3"}, 
            React.createElement("p", {className: "header-title"}, React.createElement("strong", null, "$Price", React.createElement("span", {className: "currency"}, "USD")), React.createElement("span", {className: "book-span"}, React.createElement("a", {className: "book-link"}, "Book")))
          )
        )
      )
    );
  }
});

var Description = React.createClass({displayName: "Description",
  render: function() {
    return (
      React.createElement("div", {className: "description"}, 
        React.createElement("p", {className: "description-label"}, React.createElement("strong", null, "Description")), 
        React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a massa dui. Praesent ac sapien est. Nullam in fermentum ipsum. Nulla nec ullamcorper risus. Curabitur maximus facilisis eros, eu dapibus eros efficitur consectetur. Proin rhoncus elit id libero convallis, eu placerat quam interdum. Aliquam iaculis tellus dolor, in aliquet erat faucibus ultricies. Duis aliquam nulla eu pretium auctor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed malesuada lacus sed tortor feugiat, tristique lobortis enim vulputate. Nam a dictum quam, ac fringilla nisl.")
      )
    );
  }
});

var Photos = React.createClass({displayName: "Photos",
  getInitialState: function() {
    return {photos: [], mainPhoto: -1, more: false};
  },
  componentWillMount: function() {
    this.getPhotos();
  },
  getPhotos: function() {
    $.ajax({
      url: "../assets/test/photos.json",
      dataType: "json",
      type: "GET",
      success: function(data) {
        var i = data.length > 0 ? 0 : -1;
        this.setState({photos: data, mainPhoto: i});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("Reviews test", status, err.toString());
      }.bind(this)
    });
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
      React.createElement("div", null, 
        React.createElement(MainPhoto, {photos: this.state.photos, mainPhoto: this.state.mainPhoto}), 
        React.createElement(OtherPhotos, {photos: this.state.photos, mainPhoto: this.state.mainPhoto, more: this.state.more, selectPhoto: this.selectPhoto, showMore: this.showMore, showLess: this.showLess})
      )
    );
  }
});

var MainPhoto = React.createClass({displayName: "MainPhoto",
  render: function() {
    return (
      this.props.mainPhoto >= 0 ?
        React.createElement("div", {className: "main-photo", style: {background: "url(" + this.props.photos[this.props.mainPhoto] + ") no-repeat center center", backgroundSize: "contain"}}, 
          React.createElement("div", {className: "photo-left-arrow"}, React.createElement("i", {className: "fa fa-arrow-circle-left fa-3x"})), 
          React.createElement("div", {className: "photo-right-arrow"}, React.createElement("i", {className: "fa fa-arrow-circle-right fa-3x"}))
        )
      : React.createElement("div", {className: "main-photo"})
    );
  }
});

var OtherPhotos = React.createClass({displayName: "OtherPhotos",
  render: function() {
    var photos = [];
    for(var i = 0; i < this.props.photos.length && (this.props.more || i < 6); i++) {
      if(this.props.mainPhoto != i)
        photos.push(React.createElement("div", {key: i, className: "other-photo", style: {background: "url(" + this.props.photos[i] + ") no-repeat center center", backgroundSize: "cover"}, onClick: this.props.selectPhoto.bind(this, i)}));
    }
    if(this.props.photos.length > 0 && !this.props.more)
      photos.push(React.createElement("div", {className: "other-photo more-photos", onClick: this.props.showMore}, "View More"));
    else if(this.props.photos.length > 0)
      photos.push(React.createElement("div", {className: "other-photo more-photos", onClick: this.props.showLess}, "View Less"));
    return (
      React.createElement("div", null, 
        photos
      )
    );
  }
});

var Tags = React.createClass({displayName: "Tags",
  render: function() {
    var tags = $.map(this.props.tags, function(tag, i) {
      return (
        React.createElement(Tag, {key: i, index: i, name: tag.name, type: tag.type, toggleTag: this.props.toggleTag})
      );
    }.bind(this));
    return (
      React.createElement("div", {className: "tags"}, 
        React.createElement("p", {className: "tags-label"}, React.createElement("strong", null, "Tags")), 
        React.createElement("div", {className: "tags"}, 
          tags
        )
      )
    );
  }
});

var Tag = React.createClass({displayName: "Tag",
  handleClick: function() {
    this.props.toggleTag(this.props.index);
  },
  render: function() {
    return (
      React.createElement("div", {className: this.props.type == 0 ? "tag tag-selected" : "tag tag-unselected", onClick: this.handleClick}, this.props.name)
    );
  }
});

var Reviews = React.createClass({displayName: "Reviews",
  getInitialState: function() {
    return {reviews: []}
  },
  componentWillMount: function() {
    this.getReviews();
  },
  getReviews: function() {
    $.ajax({
      url: "../assets/test/reviews.json",
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
        reviews.push(React.createElement(Review, {key: i, reviewer: review.reviewer, date: review.date, review: review.review}));
      else
        for(var j = 0; j <  selectedTags.length; j++) {
          if(review.tags.indexOf(selectedTags[j]) != -1) {
            reviews.push(React.createElement(Review, {key: i, reviewer: review.reviewer, date: review.date, review: review.review}));
            break;
          }
        }
    });
    return (
      React.createElement("div", {className: "reviews"}, 
        React.createElement("p", {className: "reviews-label"}, React.createElement("strong", null, "Reviews")), 
        React.createElement("p", {className: "reviews-copy"}, "Showing ", React.createElement("strong", null, reviews.length), " (of ", this.state.reviews.length, " total reviews) ", selectedTags.length > 0 ? React.createElement("span", null, "related with ", React.createElement("strong", null, selectedString)) : ""), 
        React.createElement("div", null, 
          reviews
        )
      )
    );
  }
});

var Review = React.createClass({displayName: "Review",
  render: function() {
    return (
      React.createElement("div", {className: "review"}, 
        React.createElement("p", {className: "review-label"}, React.createElement("strong", null, this.props.reviewer), " (", React.createElement("i", null, this.props.date), ")"), 
        React.createElement("p", null, this.props.review)
      )
    );
  }
});

var ReviewsSection = React.createClass({displayName: "ReviewsSection",
  getInitialState: function() {
    return {tags: []};
  },
  componentWillMount: function() {
    this.getTags();
  },
  getTags: function() {
    $.ajax({
      url: "../assets/test/tags.json",
      dataType: "json",
      type: "GET",
      success: function(data) {
        this.setState({tags: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("Tags test", status, err.toString());
      }.bind(this)
    });
  },
  toggleTag: function(i) {
    var tags = this.state.tags.slice();
    tags[i].type = 1 - tags[i].type;
    this.setState(tags);
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Tags, {tags: this.state.tags, toggleTag: this.toggleTag}), 
        React.createElement(Reviews, {tags: this.state.tags})
      )
    );
  }
});

var Content = React.createClass({displayName: "Content",
  render: function() {
    return (
      React.createElement("div", {className: "container-fluid content"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-9"}, 
            React.createElement(Photos, null), 
            React.createElement(ReviewsSection, null)
          ), 
          React.createElement("div", {className: "col-md-3"}, 
            React.createElement(Description, null)
          )
        )
      )
    );
  }
});

var Detail = React.createClass({displayName: "Detail",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Header, null), 
        React.createElement(Content, null)
      )
    );
  }
});

React.render(React.createElement(Detail, null), document.getElementById("content"));
