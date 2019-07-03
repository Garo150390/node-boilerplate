const BaseDAO = require('../../core/base-dao');
const UsersSchema = require('./model');

class UsersDAO extends BaseDAO {
  constructor() {
    super('users', UsersSchema);
  }

  fetchMany(query = {}, options = {}) {
    return super.fetchMany(query, options)
      .select({
        __v: 0, hash: 0, iteration: 0, salt: 0,
      })
      .exec();
  }
}

module.exports = new UsersDAO();
