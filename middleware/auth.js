const jwt = require('jsonwebtoken');

const UserDAO = require('../components/users/private/dao');
const conf = require('../config');

const secret = process.env.JWT_SECRET || conf.get('jwr:secret');

class Authorization {
  static authorizeRequest(access) {
    return (req, res, next) => {
      if (access === 'editor') {
        return next();
      }
      const authHeader = req.get('authorization');
      if (!authHeader) {
        return res.status(401).json({ message: 'token not provided' });
      }
      const token = authHeader.replace('Bearer ', '');
      let payload;
      try {
        payload = jwt.verify(token, secret);
        if (payload.type !== conf.get('jwt:tokens:access:type')) {
          return res.status(400).json({ message: 'invalid token!' });
        }
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ message: 'Token expired!' });
        }
        return res.status(401).json(error);
      }
      return UserDAO.fetchOne({ _id: payload.userId })
        .then((user) => {
          if (!user) {
            return res.status(400).json({ message: 'access denied: invalid token' });
          }
          req.user = user;
          if (access === 'admin' && user.role !== 'admin') {
            return res.status(403).json({ message: 'permission denied' });
          }
          return next();
        })
        .catch(err => res.json(err));
    };
  }
}

module.exports = Authorization;
