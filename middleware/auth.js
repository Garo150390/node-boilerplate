class Authorization {
  static authorizeRequest(access) {
    return (req, res, next) => {
      const { user } = req;
      if (access === 'admin' && user.role !== 'admin') {
        return res.status(403).json({ message: 'permission denied' });
      }
      return next();
    };
  }
}

module.exports = Authorization;
