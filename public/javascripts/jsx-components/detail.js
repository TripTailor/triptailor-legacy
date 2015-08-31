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
      <div>
        <p className="description-label"><strong>Description</strong></p>
        <p className="description-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a massa dui. Praesent ac sapien est. Nullam in fermentum ipsum. Nulla nec ullamcorper risus. Curabitur maximus facilisis eros, eu dapibus eros efficitur consectetur. Proin rhoncus elit id libero convallis, eu placerat quam interdum. Aliquam iaculis tellus dolor, in aliquet erat faucibus ultricies. Duis aliquam nulla eu pretium auctor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed malesuada lacus sed tortor feugiat, tristique lobortis enim vulputate. Nam a dictum quam, ac fringilla nisl.</p>
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
    return (
      <div className="tags">
        <p className="tags-label"><strong>Tags</strong></p>
        <div className="tags">

        </div>
      </div>
    );
  }
});

var Reviews = React.createClass({
  render: function() {
    return (
      <div>
        <p className="reviews-label"><strong>Reviews</strong></p>
        <div className="reviews">

        </div>
      </div>
    );
  }
});

var ReviewsSection = React.createClass({
  render: function() {
    return (
      <div>
        <Tags />
        <Reviews />
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
