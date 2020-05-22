  const Redis = require('ioredis');

const logger = require('../lib/logger');

const nconf = require('../config');

const db = new Redis(nconf.get('redis'));

db.connect(() => {
  logger.debug('Redis client connected to server');
});

db.on('error', (err) => {
  logger.error('Redis error: %s', err);
  db.disconnect();
  // process.exit(1);
});

module.exports = db;
