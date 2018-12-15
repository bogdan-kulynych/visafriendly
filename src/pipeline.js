import {parseVisaData, parseLgbtData} from './parse';

import $ from 'jquery';


function runDataPipeline() {
  const visaDataPath = 'data/passport-index-dataset/passport-index-country-names.csv';
  const lgbtDataPath = 'data/lgbt/lgb_2012.csv';

  let processedData = {};
  let visaDataPromise = $.get(visaDataPath);
  let lgbtDataPromise = $.get(lgbtDataPath);

  return Promise.all([visaDataPromise, lgbtDataPromise])
    .then(([visaData, lgbtData]) => {
      [processedData.countries, processedData.visaMat] = parseVisaData(visaData);
      processedData.lgbtLegalByCountry = parseLgbtData(lgbtData);
      return new Promise((resolve, reject) => {
        resolve(processedData);
      });
    });
};


function getRankedCountryScores(processedData) {
  let scoreByCountry = new Map();
  processedData.countries.map(function(country, i) {
    let visaRow = processedData.visaMat[i];
    let sum = visaRow.reduce((a, b) => a + b, 0);
    scoreByCountry.set(country, sum);
  });

  rankedCountryScores = new Map(
    [...scoreByCountry.entries()].sort(function([_, a], [__, b]) {
      return b - a;
    })
  );

  return rankedCountryScores;
}


export default runDataPipeline;
export {getRankedCountryScores};
