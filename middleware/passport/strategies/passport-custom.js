const { ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const logger = require('../../../lib/logger');

const UserDAO = require('../../../src/components/users/private/dao');
// const logger = require('../../lib/logger');
const nconf = require('../../../config');

const secret = nconf.get('JWT_SECRET') || nconf.get('jwt:secret');

const passportCustom = async (req, done) => {
  const _id = mongoose.Types.ObjectId();
  try {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (token) {
      const payload = jwt.verify(token, secret);
      if (payload.type !== nconf.get('jwt:tokens:access:type')) {
        // return done({ status: 401, message: 'invalid token!' }, false);
        logger.debug('token exist but invalid!');
        req.message = 'Invalid token!';
        req.code = 401;
        return done(null, { _id, role: 'guest', name: 'guest' });
      }
      const user = await UserDAO.fetchOne({ _id: payload.userId });
      if (user) {
        return done(null, user);
      }
      logger.debug('token not such user!');
      return done(null, false);
    }
    return done(null, { _id, role: 'guest', name: 'guest' });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // return done({ status: 401, message: 'Token expired!' }, false);
      logger.debug('token exist but expired!');
      req.message = 'Token expired!';
      req.code = 401;
      return done(null, { _id, role: 'guest', name: 'guest' });
    }
    logger.debug('token exist but not valid!');
    req.message = 'Invalid token!';
    req.code = 401;
    return done(null, { _id, role: 'guest', name: 'guest' });
  }
};

module.exports = passportCustom;
