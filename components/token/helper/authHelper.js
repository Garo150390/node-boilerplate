const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

const TokenDAO = require('../private/dao');
const conf = require('../../../config');

const secret = process.env.JWT_SECRET || conf.get('jwr:secret');

module.exports.generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: conf.get('jwt:tokens:access:type'),
  };
  const options = { expiresIn: conf.get('jwt:tokens:access:expiresIn') };
  return jwt.sign(payload, secret, options);
};

module.exports.generateRefreshToken = () => {
  const payload = {
    id: uuid(),
    type: conf.get('jwt:tokens:refresh:type'),
  };
  const options = { expiresIn: conf.get('jwt:tokens:refresh:expiresIn') };
  return {
    id: payload.id,
    token: jwt.sign(payload, secret, options),
  };
};

module.exports.replaceDbRefreshToken = async (tokenId, userId) => {
  try {
    await TokenDAO.removeToken({ userId });
    return await TokenDAO.insert({ tokenId, userId });
  } catch (e) {
    return Promise.reject(e);
  }
};
