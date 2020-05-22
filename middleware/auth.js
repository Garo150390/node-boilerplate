const response = require('../helpers/http/response');

class Authorization {
  static permit(access) {
    return (req, res, next) => {
      const status = response.status.FORBIDDEN;
      const { user } = req;

      if (!user) {
        const data = response.dispatch({
          error: req.message || 'Permission denied',
          code: req.code || status,
        });
        return res.status(status).json(data);
      }

      // admin part
      if (user.role === 'admin') {
        return next();
      }

      if (access === 'admin') {
        const data = response.dispatch({
          error: req.message || 'Permission denied',
          code: req.code || status,
        });
        return res.status(status).json(data);
      }

      // editor part
      if (user.role === 'editor') {
        return next();
      }

      if (access === 'editor') {
        const data = response.dispatch({
          error: req.message || 'Permission denied',
          code: req.code || status,
        });
        return res.status(status).json(data);
      }

      return next();
    };
  }
}

module.exports = Authorization;
