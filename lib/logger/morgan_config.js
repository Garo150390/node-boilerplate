const morgan = require('morgan');

const logger = require('../logger');

morgan.token('user', req => req.user && req.user.name);

const morganFormat = ':method :url :status :response-time ms :user';
const opts = {
  stream: logger.stream,
};

module.exports = morgan(morganFormat, opts);
