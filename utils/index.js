const mongoose = require('mongoose');
const { addDays, format } = require('date-fns');

const logger = require('../lib/logger');
const query = require('./query');

const parseDateTo = (date) => {
  const d = date ? new Date(date) : new Date();
  return format(addDays(d, 1), 'yyyy-MM-dd');
};

const updateObj = (obj, updateval) => {
  Object.keys(updateval).forEach((prop) => {
    if ((obj[prop]) && (typeof obj[prop] === 'string')) {
      // eslint-disable-next-line no-param-reassign
      obj[prop] = updateval[prop];
      return;
    }

    if (obj[prop] && obj[prop] instanceof Date) {
      // eslint-disable-next-line no-param-reassign
      obj[prop] = updateval[prop].toISOString();
      return;
    }

    if (obj[prop] && obj[prop] instanceof Array) {
      // eslint-disable-next-line no-param-reassign
      obj[prop] = updateval[prop];
      return;
    }

    if (obj[prop] instanceof mongoose.Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      obj[prop] = updateval[prop];
      return;
    }

    if ((obj[prop]) && (obj[prop] instanceof Object)) {
      // eslint-disable-next-line no-param-reassign
      obj[prop] = {
        ...obj[prop],
        ...updateval[prop],
      };
      return;
    }

    // eslint-disable-next-line no-param-reassign
    obj[prop] = updateval[prop];
  });
  // eslint-disable-next-line no-param-reassign
  obj.updated = new Date();
  return obj;
};

module.exports = {
  query,
  parseDateTo,
  updateObj,
};
