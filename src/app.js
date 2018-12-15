import React, { Component } from 'react';

import {Country} from './components/country';
import runDataPipeline from './pipeline';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: []
    }
  }

  componentDidMount() {
    runDataPipeline()
      .then((data) => {
        this.setState({
          countries: data.countries
        });
      });
  }

  render() {
    return <div>{ this.props.countries }</div>;
  }
}

export default App;
