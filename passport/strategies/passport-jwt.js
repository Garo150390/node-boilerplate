const UserDAO = require('../../components/users/private/dao');
const nconf = require('../../config');

module.exports = async (payload, done) => {
  if (payload.type !== nconf.get('jwt:tokens:access:type')) {
    return done(new Error('invalid token!'), false);
  }
  try {
    const user = UserDAO.fetchOne({ _id: payload.userId });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
};
