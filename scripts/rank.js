let fs = require('fs');

let dataParser = require('../js/parse');


const visaDataPath = 'data/passport-index-dataset/passport-index-country-names.csv';
const lgbtDataPath = 'data/lgbt/lgb_2012.csv';

let rawVisaData = fs.readFileSync(visaDataPath)
let [countries, visaMat] = dataParser.parseVisaData(rawVisaData.toString());

let rawLgbtData = fs.readFileSync(lgbtDataPath);
let lgbtLegalByCountry = dataParser.parseLgbtData(rawLgbtData.toString());

let scoreByCountry = new Map();
countries.map(function(country, i) {
  let visaRow = visaMat[i];
  let sum = visaRow.reduce((a, b) => a + b, 0);
  scoreByCountry.set(country, sum);
});

let rankedCountryScores = new Map(
  [...scoreByCountry.entries()].sort(function([_, a], [__, b]) {
    return b - a;
  })
);

for ([country, score] of rankedCountryScores) {
  if (lgbtLegalByCountry.get(country) > 0) {
    console.log(`${country},${score}`);
  }
}
