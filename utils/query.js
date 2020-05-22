const nconf = require('../config');

const queryOps = nconf.get('query');

const MAX_DATE = new Date('3970-01-01 08:00:00');
const MIN_DATE = new Date('1970-01-01 08:00:00');

const normalizeOffset = (limit, query) => {
  const offset = parseInt(query.offset, 10) < 0 ? 0 : query.offset;
  const parsedPage = parseInt(query.page, 10);
  const page = !parsedPage || parsedPage <= 1 ? 0 : (parsedPage - 1) * limit;
  return offset || page;
};

const normalizeLimit = (queryLimit) => {
  const limit = parseInt(queryLimit, 10);
  return (limit >= queryOps.limit_min && limit <= queryOps.limit_max) ? limit : queryOps.limit_default;
};

const parseDefaultQuery = (query = {}) => {
  const limit = normalizeLimit(query.limit);
  const offset = normalizeOffset(limit, query);

  return {
    sort: '-created',
    ...query,
    limit,
    offset,
  };
};

module.exports = {
  MAX_DATE,
  MIN_DATE,
  normalizeOffset,
  normalizeLimit,
  parseDefaultQuery,
};
