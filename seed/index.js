const { readdirSync } = require('fs');
const { resolve, extname } = require('path');
const minimist = require('minimist');

const db = require('../lib/db_connect');

const argv = minimist(process.argv.slice(2));
console.log(argv);

const seeds = [];
readdirSync(__dirname)
  .filter((file) => {
    if (argv.only) {
      return file === argv.only || file === `${argv.only}.js`;
    }

    if (argv._.length) {
      return argv._.includes(file) || argv._.includes(`${file.replace('.js', '')}`);
    }
    return extname(file) === '.js' && file !== 'index.js';
  })
  .forEach((file) => {
    seeds.push(require(resolve(__dirname, file)).up().then(() => console.log('%s seed completed', file)));
  });

Promise.all(seeds)
  .then(() => {
    db.disconnect();
  })
  .catch((err) => {
    console.log(err);
    db.disconnect();
  });
