import {parseCountriesData, parseVisaData, parseConflictData, parseLgbtData} from './parse';

import $ from 'jquery';


function runDataPipeline() {
  const countriesDataPath = 'data/world/codes.csv';
  const lgbtDataPath = 'data/lgbt/lgb_2012.csv';
  const conflictDataPath = 'data/conflicts/data_2018.csv';
  const visaDataPath = 'data/passport-index-dataset/passport-index-country-names.csv';

  let processedData = {};
  let promises = [
    $.get(countriesDataPath),
    $.get(visaDataPath),
    $.get(conflictDataPath),
    $.get(lgbtDataPath)
  ]

  return Promise.all(promises)
    .then(([countriesData, visaData, conflictData, lgbtData]) => {
      [processedData.alphaByCountry, processedData.numCodeByCountry] = parseCountriesData(
          countriesData);
      processedData.lgbtLegalByCountry = parseLgbtData(lgbtData);
      processedData.conflictByCountry = parseConflictData(conflictData);
      [processedData.countries, processedData.visaMat] = parseVisaData(visaData);
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

  let rankedCountryScores = new Map(
    [...scoreByCountry.entries()].sort(function([_, a], [__, b]) {
      return b - a;
    })
  );

  return rankedCountryScores;
}

export {runDataPipeline, getRankedCountryScores};
