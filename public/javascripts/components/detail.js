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
      React.createElement("div", null, 
        React.createElement("p", {className: "description-label"}, React.createElement("strong", null, "Description")), 
        React.createElement("p", {className: "description-text"}, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a massa dui. Praesent ac sapien est. Nullam in fermentum ipsum. Nulla nec ullamcorper risus. Curabitur maximus facilisis eros, eu dapibus eros efficitur consectetur. Proin rhoncus elit id libero convallis, eu placerat quam interdum. Aliquam iaculis tellus dolor, in aliquet erat faucibus ultricies. Duis aliquam nulla eu pretium auctor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed malesuada lacus sed tortor feugiat, tristique lobortis enim vulputate. Nam a dictum quam, ac fringilla nisl.")
      )
    );
  }
});

var Photos = React.createClass({displayName: "Photos",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "main-photo"}

        ), 
        React.createElement("div", {className: "other-photos"}

        )
      )
    );
  }
});

var Tags = React.createClass({displayName: "Tags",
  render: function() {
    var tags = $.map(this.props.tags, function(tag, i) {
      return (
        React.createElement(TripTailorTag, {key: i, name: tag.name, type: tag.type})
      );
    });
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
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Tags, {tags: this.state.tags}), 
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
