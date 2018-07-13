/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */

const fs = require('fs');

const aggregate = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  const dataRow = data.split('\n');

  const allCountConti = new Map();
  const cc = fs.readFileSync('./data/cc-mapping.txt', 'utf8');
  const ccRow = cc.split('\n');
  for (let i = 1; i < ccRow.length; i += 1) {
    const ccIndi = ccRow[i].split(',');
    allCountConti.set(ccIndi[0], ccIndi[1]);
  }

  const countPop = new Map();
  const countGdp = new Map();
  const countConti = new Map();
  for (let i = 1; i < dataRow.length - 2; i += 1) {
    const dataIndi = dataRow[i].split(',');
    countPop.set(dataIndi[0].slice(1, -1), dataIndi[4].slice(1, -1));
    countGdp.set(dataIndi[0].slice(1, -1), dataIndi[7].slice(1, -1));
    countConti.set(dataIndi[0].slice(1, -1), allCountConti.get(dataIndi[0].slice(1, -1)));
  }

  const contiPop = new Map();
  const contiGdp = new Map();

  countConti.forEach((continent, popVal) => {
    if (contiPop.has(continent)) {
      contiPop.set(continent, parseFloat(contiPop.get(continent))
        + parseFloat(countPop.get(popVal)));
    } else {
      contiPop.set(continent, parseFloat(countPop.get(popVal)));
    }
  });
  countConti.forEach((continent, gdpVal) => {
    if (contiGdp.has(continent)) {
      contiGdp.set(continent, parseFloat(contiGdp.get(continent))
        + parseFloat(countGdp.get(gdpVal)));
    } else {
      contiGdp.set(continent, parseFloat(countGdp.get(gdpVal)));
    }
  });

  const output = {};

  const out = './output/output.json';

  contiGdp.forEach((val, continent) => {
    output[continent] = {
      GDP_2012: val,
      POPULATION_2012: contiPop.get(continent),
    };
  });

  fs.writeFileSync(out, JSON.stringify(output));
};

module.exports = aggregate;
