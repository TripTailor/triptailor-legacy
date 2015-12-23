var Header = React.createClass({displayName: "Header",
  componentDidMount: function() {
    mixpanel.track_links("#bookLink", "Booking", {
      "hostel": hostel.name,
      "price": hostel.price,
      "currency": hostel.currency
    });
  },
  render: function() {
    return (
      React.createElement("div", {className: "container-fluid header"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-9"}, 
            React.createElement("p", {className: "header-title"}, React.createElement("strong", null, hostel.name))
            /* <p className="hostel-address">Street and number, Neighborhood, City, Country</p> */
          ), 
          React.createElement("div", {className: "col-md-3"}, 
            React.createElement("p", {className: "header-title"}, React.createElement("strong", null, this.props.price, " ", React.createElement("span", {className: "currency"}, this.props.currency)), hostel.url != null ? React.createElement("span", {className: "book-span"}, React.createElement("a", {id: "bookLink", href: hostel.url + "?dateFrom=" + getQueryValue("date-from") + "&dateTo=" + getQueryValue("date-to") + "&affiliate=triptailor.co", target: "_blank", className: "book-link"}, "Book")) : "")
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
        React.createElement("div", {dangerouslySetInnerHTML: {__html: hostel.description}})
      )
    );
  }
});

var Photos = React.createClass({displayName: "Photos",
  getInitialState: function() {
    return {photos: hostel.images, mainPhoto: hostel.images.length > 0 ? 0 : -1, more: false};
  },
  componentWillMount: function() {
    preloadPhotos(this.state.photos);
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
        React.createElement(MainPhoto, {photos: this.state.photos, mainPhoto: this.state.mainPhoto, selectRight: this.selectRight, selectLeft: this.selectLeft}), 
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
          React.createElement("div", {className: "photo-left-arrow"}, React.createElement("i", {className: "fa fa-arrow-circle-left fa-3x", onClick: this.props.selectLeft})), 
          React.createElement("div", {className: "photo-right-arrow"}, React.createElement("i", {className: "fa fa-arrow-circle-right fa-3x", onClick: this.props.selectRight}))
        )
      : React.createElement("div", {className: "main-photo"})
    );
  }
});

var OtherPhotos = React.createClass({displayName: "OtherPhotos",
  render: function() {
    var photos = [];
    for(var i = 0; i < this.props.photos.length && (this.props.more || i < 4); i++) {
      var photo = this.props.mainPhoto != i ? React.createElement("div", {key: i, className: "other-photo", style: {background: "url(" + this.props.photos[i] + ") no-repeat center center", backgroundSize: "cover"}, onClick: this.props.selectPhoto.bind(this, i)}) : React.createElement("div", {key: i, className: "other-photo", style: {background: "url(" + this.props.photos[i] + ") no-repeat center center", backgroundSize: "cover"}, onClick: this.props.selectPhoto.bind(this, i)}, React.createElement("div", {className: "selected-photo"}));
      photos.push(photo);
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
  render: function() {
    var reviews = [];

    var selectedString = "";
    var selectedTags = $.map(this.props.tags, function(tag, i) {
      if(tag.type == 0) {
        selectedString += tag.name + " ";
        return tag.name;
      }
    });

    $.each(this.props.reviews, function(i, review) {
      if(selectedTags.length == 0) {
        reviews.push(React.createElement(Review, {key: i, reviewer: review.reviewer, date: review.year, review: review.text}));
      }
      else {
        var text = "";
        var start = 0;
        $.each(review.tagPositions, function(i, position) {
          if(selectedTags.indexOf(position.tag) != -1) {
            text += review.text.slice(start, position.positions[0]) + "<strong>" + review.text.slice(position.positions[0], position.positions[1]) + "</strong>";
            start = position.positions[1];
          }
        });

        if(text.length > 0) {
          text += review.text.slice(start, review.text.length);
          reviews.push(React.createElement(Review, {key: i, reviewer: review.reviewer, date: review.year, review: text}));
        }
      }
    });

    return (
      React.createElement("div", {className: "reviews"}, 
        React.createElement("p", {className: "reviews-label"}, React.createElement("strong", null, "Reviews")), 
        this.props.called ?
          React.createElement("div", null, 
            React.createElement("p", {className: "reviews-copy"}, "Showing ", React.createElement("strong", null, reviews.length), " (of ", this.props.reviews.length, " total reviews) ", selectedTags.length > 0 ? React.createElement("span", null, "related with ", React.createElement("strong", null, selectedString)) : ""), 
            React.createElement("div", null, 
              reviews
            )
          )
          : React.createElement("p", {className: "text-center"}, React.createElement("img", {src: "../../../assets/images/spinner.gif"}))
      )
    );
  }
});

var Review = React.createClass({displayName: "Review",
  render: function() {
    MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var d = new Date(this.props.date);
    var date = d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();

    return (
      React.createElement("div", {className: "review"}, 
        React.createElement("p", {className: "review-label"}, React.createElement("strong", null, date), " ", this.props.reviewer), 
        React.createElement("p", {dangerouslySetInnerHTML: {__html: this.props.review}})
      )
    );
  }
});

var ReviewsSection = React.createClass({displayName: "ReviewsSection",
  getInitialState: function() {
    return {tags: hostel.tags};
  },
  toggleTag: function(i) {
    var tags = this.state.tags.slice();
    tags[i].type = 1 - tags[i].type;
    this.setState(tags);

    mixpanel.track("Reviews Filtered", {
      "hostel": hostel.name,
      "tag": tags[i].name,
      "type": tags[i].type == 0 ? "selected" : "unselected"
    });
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Tags, {tags: this.state.tags, toggleTag: this.toggleTag}), 
        React.createElement(Reviews, React.__spread({tags: this.state.tags},  this.props))
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
            React.createElement(ReviewsSection, React.__spread({},  this.props))
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
  getInitialState: function() {
    return {reviews: hostel.reviewsData, price: hostel.price, currency: hostel.currency, called: false};
  },
  componentDidMount: function() {
    this.getPriceAndReviews();
  },
  getPriceAndReviews: function() {
    var uris = window.location.pathname.split("/");
    var tags = uris[uris.length - 1];
    var url = jsRoutes.controllers.SearchController.detailJson(hostel.name, tags).absoluteURL() + window.location.search;
    $.ajax({
      url: url,
      dataType: 'json',
      type: "GET",
      success: function(data) {
        this.setState({reviews: data.reviewsData, price: data.price, currency: data.currency, called: true});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }
    });
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Header, {price: this.state.price, currency: this.state.currency}), 
        React.createElement(Content, {reviews: this.state.reviews, called: this.state.called})
      )
    );
  }
});

React.render(React.createElement(Detail, null), document.getElementById("content"));
