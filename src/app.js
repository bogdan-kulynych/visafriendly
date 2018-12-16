import React, { Component } from 'react';

import Country from './components/country';
import {runDataPipeline, getRankedCountryScores} from './pipeline';


class App extends Component {
  constructor(props) {
    super(props);
    this.processedData = null;
    this.state = {
      mode: "GLOBAL_RANKING",
      sortedCountryNames: [],
      scoreMap: new Map(),
    }
  }

  sortCountries() {
    if (this.state.mode === "GLOBAL_RANKING") {
      let rankedCountryScores = getRankedCountryScores(this.processedData)
      this.setState({
        sortedCountryNames: [...rankedCountryScores.keys()],
        scoreMap: rankedCountryScores,
      });
    }
  }

  componentDidMount() {
    runDataPipeline()
      .then((data) => {
        this.processedData = data;
        this.sortCountries();
      });
  }

  renderCountriesList() {
    return <div>{ this.state.sortedCountryNames.map((countryName, i) =>
      <Country
          key={countryName}
          rank={i + 1}
          countryName={countryName}
          alpha={this.processedData.alphaByCountry.get(countryName)}
          numCode={this.processedData.numCodeByCountry.get(countryName)}
          score={this.state.scoreMap.get(countryName)}
          lgbtLegal={this.processedData.lgbtLegalByCountry.get(countryName)}
          conflict={this.processedData.conflictByCountry.get(countryName)}
      />
    )}</div>;
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-three-fifths">
          {this.renderCountriesList()};
        </div>
        <div className="column is-two-fifths">
        </div>
      </div>
    )
  }
}

export default App;
