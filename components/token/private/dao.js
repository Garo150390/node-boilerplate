const BaseDAO = require('../../core/base-dao');
const TokenSchema = require('./model');

class TokenDAO extends BaseDAO {
  constructor() {
    super('Tokens', TokenSchema);
  }

  removeToken(query) {
    return this.model.findOneAndRemove(query);
  }
}

module.exports = new TokenDAO();
