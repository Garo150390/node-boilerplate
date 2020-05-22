const DBConnection = require('../../../lib/db_connect');
const logger = require('../../../lib/logger');

class BaseDAO {
  constructor(collection, schema) {
    this.model = DBConnection.model(collection, schema);
  }

  async fetchMany(query = {}, projection, q) {
    const search = {
      $and: [],
      ...query,
    };

    if (!this.query && q) this.query = q;
    if ('deleted' in this.query) search.deleted = null;
    if (this.query.created_from && this.query.created_to) search.$and.push({ created: { $gte: this.query.created_from } }, { created: { $lt: this.query.created_to } });
    if (this.query.updated_from && this.query.updated_to) search.$and.push({ updated: { $gte: this.query.updated_from } }, { updated: { $lt: this.query.updated_to } });
    if (this.query.deleted_from && this.query.deleted_to) search.$and.push({ deleted: { $gte: this.query.deleted_from } }, { deleted: { $lt: this.query.deleted_to } });

    logger.debug('search === %j', search);

    if (search.$and && !search.$and.length) delete search.$and;
    const count = await this.model.countDocuments(search);
    const docs = await this.model.find(search, projection)
      .sort(this.query.sort)
      .skip(this.query.offset)
      .limit(this.query.limit);
    return { count, docs };
  }

  fetchOne(query = {}) {
    return this.model.findOne(query);
  }

  fetchById(id, projection = {}, options = {}) {
    return this.model.findById(id, options)
      .select(projection);
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

  remove(id) {
    return this.model.updateOne({ _id: id }, { deleted: new Date() });
  }

  removeAll() {
    return this.model.deleteMany();
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

module.exports = BaseDAO;
