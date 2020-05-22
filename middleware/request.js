const BaseDAO = require('../src/components/core/base-dao');
const response = require('../helpers/http/response');
const { parseDateTo, query } = require('../utils');
// const logger = require('../lib/logger');

const {
  MIN_DATE,
} = require('../utils/query');


class RequestService {
  static equalById(paramsId) {
    return (req, res, next) => {
      if (!req.user._id.equals(req.params[paramsId]) && req.user.role !== 'admin') {
        const status = response.status.FORBIDDEN;
        const data = response.dispatch({
          error: 'Permission denied',
          code: status,
        });
        return res.status(status).json(data);
      }
      return next();
    };
  }

  static parseQuery(req, res, next) {
    const filter = req.query;

    const q = query.parseDefaultQuery(req.query);

    if (filter.created_from || filter.created_to) {
      q.created_from = filter.created_from || MIN_DATE;
      q.created_to = parseDateTo(filter.created_to);
    }

    if (filter.updated_from || filter.updated_to) {
      q.updated_from = filter.updated_from || MIN_DATE;
      q.updated_to = parseDateTo(filter.updated_to);
    }

    if (filter.deleted_from || filter.deleted_to) {
      q.deleted_from = filter.deleted_from || MIN_DATE;
      q.deleted_to = parseDateTo(filter.deleted_to);
    }

    if (!filter.deleted || (req.user.role !== 'admin' && req.user.role !== 'editor')) {
      q.deleted = null;
    } else {
      delete q.deleted;
    }

    BaseDAO.prototype.query = q;
    next();
  }
}

module.exports = RequestService;
