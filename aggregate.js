/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */

const fs = require('fs');

const aggregate = filePath => new Promise((resolve1, reject1) => {
  const countryContinentArray = (file) => {
    const a = new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, items) => {
        if (err) {
          reject(err);
        } else {
          const splitRow = items.split('\n');
          let splitIndi;
          const AllCCMap = new Map();
          for (let i = 0; i < splitRow.length - 1; i += 1) {
            splitIndi = splitRow[i].split(',');
            AllCCMap.set(splitIndi[0], splitIndi[1]);
          }
          resolve(AllCCMap);
        }
      });
    });
    return a;
  };

  const countryGdpPop = (file) => {
    const a = new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, items) => {
        if (err) {
          reject(err);
        } else {
          const splitRow = items.split('\n');
          let splitInd;
          const countGdp = new Map();
          const countPop = new Map();
          for (let i = 1; i < splitRow.length - 2; i += 1) {
            splitInd = splitRow[i].split(',');

            countGdp.set(splitInd[0].slice(1, -1), splitInd[4].slice(1, -1));
            countPop.set(splitInd[0].slice(1, -1), splitInd[7].slice(1, -1));
          }
          const Arr = [countGdp, countPop];
          resolve(Arr);
        }
      });
    });
    return a;
  };

  Promise.all([countryContinentArray('./data/cc-mapping.txt'), countryGdpPop(filePath)]).then((values) => {
    const contiPop = new Map();
    const contiGdp = new Map();
    values[1][1].forEach((popVal, country) => {
      if (contiPop.has(values[0].get(country))) {
        contiPop.set(values[0].get(country), parseFloat(contiPop.get(values[0].get(country)))
          + parseFloat(popVal));
      } else {
        contiPop.set(values[0].get(country), parseFloat(popVal));
      }
    });
    values[1][0].forEach((popVal, country) => {
      if (contiGdp.has(values[0].get(country))) {
        contiGdp.set(values[0].get(country), parseFloat(contiGdp.get(values[0].get(country)))
          + parseFloat(popVal));
      } else {
        contiGdp.set(values[0].get(country), parseFloat(popVal));
      }
    });
    const output = {};
    contiPop.forEach((val, continent) => {
      output[continent] = {
        GDP_2012: val,
        POPULATION_2012: contiGdp.get(continent),
      };
    });
    const outputpath = './output/output.json';
    fs.writeFile(outputpath, JSON.stringify(output), (err) => {
      if (err) reject1(err);
      else resolve1();
    });
  });
});

module.exports = aggregate;
