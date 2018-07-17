/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const mapPath = './output/cc-mapping.json';
const outputFilePath = './output/output.json';
const readFilePromise = datafilePath => new Promise((resolve, reject) => {
  fs.readFile(datafilePath, 'utf8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});
const writeFilePromise = (writeFilePath, data) => new Promise((resolve, reject) => {
  fs.writeFile(writeFilePath, data, (err) => {
    if (err) reject(err);
    else resolve(data);
  });
});
const aggregate = filePath => new Promise((resolve, reject) => {
  Promise.all([readFilePromise(filePath), readFilePromise(mapPath)]).then((values) => {
    const [headerText, ...dataRow] = values[0].split('\n');
    const countryIndex = headerText.replace(/"/g, '').indexOf('Country Name');
    const pop2012Index = headerText.replace(/"/g, '').split(',').indexOf('Population (Millions) - 2012');
    const gdp2012Index = headerText.replace(/"/g, '').split(',').indexOf('GDP Billions (US Dollar) - 2012');
    const dataMap = JSON.parse(values[1]);
    const aggregateData = {};
    dataRow.forEach((row) => {
      const rowData = row.replace(/"/g, '').split(',');
      if (dataMap[rowData[countryIndex]] !== undefined) {
        const geContinent = dataMap[rowData[countryIndex]];
        if (aggregateData[geContinent] === undefined) {
          aggregateData[geContinent] = {};
          aggregateData[geContinent].GDP_2012 = parseFloat(rowData[gdp2012Index]);
          aggregateData[geContinent]
            .POPULATION_2012 = parseFloat(rowData[pop2012Index]);
        } else {
          aggregateData[geContinent].GDP_2012 += parseFloat(rowData[gdp2012Index]);
          aggregateData[geContinent]
            .POPULATION_2012 += parseFloat(rowData[pop2012Index]);
        }
      }
    });
    writeFilePromise(outputFilePath, JSON.stringify(aggregateData)).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  }).catch((error) => {
    reject(error);
  });
});
module.exports = aggregate;
