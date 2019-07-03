const mongoose = require('mongoose');

const conf = require('../config');

mongoose.Promise = Promise;

const connect = process.env.MONGODB_URL
  || `mongodb://${conf.get('db:host')}:${conf.get('db:port')}/${conf.get('db:dbName')}`;

mongoose.connect(connect, { useNewUrlParser: true, useCreateIndex: true });
mongoose.set('debug', true);

module.exports = mongoose;
