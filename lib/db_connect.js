const mongoose = require('mongoose');

const logger = require('../lib/logger');
const nconf = require('../config');

mongoose.Promise = Promise;
const env = nconf.get('NODE_ENV') || 'development';
const config = nconf.get('db')[env];

nconf.set('dbName', config.database);

let connect;
if (config.use_env_variable) {
  connect = nconf.get(config.use_env_variable);
} else {
  connect = `mongodb://${config.host}:${config.port}/${config.database}`;
}

mongoose.connect(connect, config.options)
  .then(() => {
    logger.debug('Mongo connected');
  })
  .catch((err) => {
    logger.error('Mongo connect Error => %j', err);
  });

if (config.debug) {
  mongoose.set('debug', true);
}

module.exports = mongoose;
