const { ExtractJwt } = require('passport-jwt');

const UserDAO = require('../../../src/components/users/private/dao');
const nconf = require('../../../config');

const secret = nconf.get('JWT_SECRET') || nconf.get('jwt:secret');

const passportJwt = async (payload, done) => {
  if (payload.type !== nconf.get('jwt:tokens:access:type')) {
    return done({ status: 401, message: 'invalid token!' }, false);
  }
  try {
    const user = await UserDAO.fetchOne({ _id: payload.userId });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
};

passportJwt.opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

module.exports = passportJwt;
