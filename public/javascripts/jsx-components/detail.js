var Header = React.createClass({
  render: function() {
    return (
      <div className="container-fluid header">
        <div className="row">
          <div className="col-md-9">
            <p className="header-title"><strong>Hostel Name</strong></p>
            <p className="hostel-address">Street and number, Neighborhood, City, Country</p>
          </div>
          <div className="col-md-3">
            <p className="header-title"><strong>$Price<span className="currency">USD</span></strong><span className="book-span"><a className="book-link">Book</a></span></p>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a massa dui. Praesent ac sapien est. Nullam in fermentum ipsum. Nulla nec ullamcorper risus. Curabitur maximus facilisis eros, eu dapibus eros efficitur consectetur. Proin rhoncus elit id libero convallis, eu placerat quam interdum. Aliquam iaculis tellus dolor, in aliquet erat faucibus ultricies. Duis aliquam nulla eu pretium auctor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed malesuada lacus sed tortor feugiat, tristique lobortis enim vulputate. Nam a dictum quam, ac fringilla nisl.</p>
      </div>
    );
  }
});

var Photos = React.createClass({
  render: function() {
    return (
      <div>
        <div className="main-photo">

        </div>
        <div className="other-photos">

        </div>
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
      <div>
        <Tags tags={this.state.tags} toggleTag={this.toggleTag} />
        <Reviews tags={this.state.tags} />
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
