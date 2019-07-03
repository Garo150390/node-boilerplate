const DBConnection = require('../../lib/db_connect');

class BaseDAO {
  constructor(collection, schema) {
    this.model = DBConnection.model(collection, schema);
  }

  fetchMany(query = {}, options = {}) {
    return this.model.find(query)
      .skip(options.offset)
      .limit(options.limit)
      .sort(options.sort || {});
  }

  fetchOne(query = {}) {
    return this.model.findOne(query);
  }

  insert(obj) {
    return this.model.create(obj);
  }

  insertMany(array) {
    return this.model.insertMany(array);
  }

  update(query, update) {
    return this.model.updateOne(query, update);
  }

  remove(query) {
    return this.model.deleteOne(query);
  }

  removeAll() {
    return this.model.remove();
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

module.exports = BaseDAO;
