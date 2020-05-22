const jwt = require('jsonwebtoken');

const response = require('../../../helpers/http/response');
const { updateToken } = require('./authToken');
const TokenDAO = require('./private/dao');
const nconf = require('../../../config');

const { secret, tokens } = nconf.get('jwt');

exports.refreshTokens = async (req, res, next) => {
  try {
    const payload = jwt.verify(req.body.refreshToken, secret);
    if (payload.type !== tokens.refresh.type) {
      const status = response.status.UNAUTHORIZED;
      const data = response.dispatch({
        error: 'invalid token!',
        code: status,
      });
      return res.status(status).json(data);
    }
    const token = await TokenDAO.fetchOne({ tokenId: payload.id });

    if (!token) {
      const status = response.status.UNAUTHORIZED;
      const data = response.dispatch({
        error: 'invalid token!',
        code: status,
      });
      return res.status(status).json(data);
    }

    const updatedToken = await updateToken(token.userId);
    const data = response.dispatch({
      data: updatedToken,
    });
    return res.json(data);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      const status = response.status.UNAUTHORIZED;
      const data = response.dispatch({
        error: 'RefreshToken expired!',
        code: status,
      });
      return res.status(status).json(data);
    }
    return next(e);
  }
};
