import React, { Component } from 'react';

class Country extends Component {
  render() {
    const title = this.props.countryName;

    return (
      <article onClick={this.handleClick}>
        <div> {title} </div>
      </article>
    );
  }
}

export default Country;
