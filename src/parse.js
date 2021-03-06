const parse = require('csv-parse/lib/sync');


function normalizeCountryName(country) {

  // Normalized versions of country names.
  const countryMapping = {
    'Russian Federation': 'Russia',
    'Viet Nam': 'Vietnam',
    'Syrian Arab Republic': 'Syria',
    'UK': 'United Kingdom',
    'United States': 'United States of America',
    'USA': 'United States of America',
    'Brunei Darussalam': 'Brunei',
    'Trinidad & Tobago': 'Trinidad and Tobago',
    'Gambia, The': 'Gambia',
    'DR Congo': 'Democratic Republic of the Congo',
    'Congo, Democratic Republic of the': 'Democratic Republic of the Congo',
    'Micronesia': 'Federated States of Micronesia',
    'Micronesia, Federated States of': 'Federated States of Micronesia',
    'Bosnia & Herzgovinia': 'Bosnia and Herzegovina',
  };

  let fixedCountry = country;
  if (countryMapping.hasOwnProperty(country)) {
    fixedCountry = countryMapping[country];
  }

  return fixedCountry;
}


function parseCountriesData(data) {
  let csvSettings = {
    delimiter: ';',
    quote: '"',
    skip_empty_lines: true,
  };

  const colIndex = {
    countryName: 0,
    alpha: 1,
    numCode: 3,
  }

  let parsedData = parse(data, csvSettings).slice(1);
  let alphaByCountry = new Map();
  let numCodeByCountry = new Map();

  for (let row of parsedData) {
    let country = row[colIndex.countryName];
    let alpha = row[colIndex.alpha];
    let numCode = row[colIndex.numCode];
    alphaByCountry.set(country, alpha);
    numCodeByCountry.set(country, numCode);
  }

  return [alphaByCountry, numCodeByCountry];
}


function parseLgbtData(data) {
  const dataPatches = new Map(Object.entries({
    // Strong anti-propaganda laws.
    'Russia': 0,

    // Illegal in Gaza, but not West Bank.
    'Palestine': 0,

    // Missing data points.
    'Kosovo': 1,
    'Vatican': 1,
    'United Arab Emirates': 0,
    'American Samoa': 1,
    'Macao': 1,
    'Hong Kong': 1,
    'Taiwan': 1
  }));

  // Normalized data values.
  const dataMapping = {
    // Legal.
    '1': 1,
    // Illegal.
    '0': -1,
  };

  let csvSettings = {
    delimiter: ';',
    quote: "'",
    skip_empty_lines: true,
  };

  let parsedData = new Map(parse(data, csvSettings).slice(1));
  let lgbtLegalByCountry = new Map();
  for (let [country, legal] of parsedData) {
    country = normalizeCountryName(country);
    lgbtLegalByCountry.set(country, dataMapping[legal]);
  }

  // Patch the data.
  for (let [country, legal] of dataPatches) {
    lgbtLegalByCountry.set(country, legal);
  }

  return lgbtLegalByCountry;
}


function parseConflictData(data) {
  let csvSettings = {
    delimiter: ';',
    quote: '"',
    skip_empty_lines: true,
  };

  const dataMapping = {
    // Minor conflict.
    '1': 1,
    // Major conflict.
    '2': 2
  }

  let conflictTypeByCountry = new Map(parse(data, csvSettings));
  for (let [country, conflictType] of conflictTypeByCountry) {
    conflictTypeByCountry.set(country, dataMapping[conflictType]);
  }
  return conflictTypeByCountry;
}


function parseVisaData(data) {

  // Normalized data values.
  const dataMapping = {
    // Diagonal entries.
    '-1': 0,
    // Visa is required.
    '0': -1,
    // eTA / on arrival / visa-free
    '1': 1,
    '2': 1,
    '3': 1
  };

  const csvSettings = {
    delimiter: ',',
  }

  let rawData = parse(data, csvSettings);
  let [_, ...countries] = rawData[0];

  let fixedCountries = countries.map(normalizeCountryName);

  // Read the visa matrix and re-map the values.
  let fromMatrix = [];
  for (let i = 1; i < rawData.length; ++i) {
    let rawRow = rawData[i].slice(1);
    let processedRow = [];
    for (let item of rawRow) {
      processedRow.push(dataMapping[item]);
    }
    fromMatrix.push(processedRow);
    console.assert(countries[i-1] === rawData[i][0]);
  }
  let toMatrix = fromMatrix.map((x,i) => fromMatrix.map(x => x[i]));

  return [fixedCountries, toMatrix];
}


export {parseCountriesData, parseLgbtData, parseConflictData, parseVisaData};
