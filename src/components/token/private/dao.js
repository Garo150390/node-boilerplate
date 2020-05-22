const BaseDAO = require('../../core/base-dao');
const TokenSchema = require('./model');

class TokenDAO extends BaseDAO {
  constructor() {
    super('tokens', TokenSchema);
  }

  removeToken(userId) {
    return this.model.findOneAndRemove({ userId });
  }
}

module.exports = new TokenDAO();
