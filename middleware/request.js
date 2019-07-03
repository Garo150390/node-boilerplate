const conf = require('../config');

class RequestService {
  static parseQuery(req, res, next) {
    const limit = parseInt(req.query.limit, 10);
    req.limit = (limit > conf.get('query:limit_min') && limit < conf.get('query:limit_max'))
      ? limit : conf.get('query:limit_default');

    const offset = parseInt(req.query.offset, 10);
    req.offset = (offset > conf.get('query:offset_min'))
      ? offset : conf.get('query:offset_default');
    next();
  }
}

module.exports = RequestService;
