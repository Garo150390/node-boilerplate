const jwt = require('jsonwebtoken');

const TokenDAO = require('./private/dao');
const { updateToken } = require('./authToken');
const { secret, tokens } = require('../../config')('jwt');
const response = require('../../helpers/http/response');

exports.refreshTokens = async (req, res, next) => {
  if (!req.body.refreshToken) {
    const status = response.status.BAD_REQUEST;
    const data = response.dispatch({
      error: [{
        refreshToken: 'refreshToken can\'t be blank',
      }],
    });
    return res.status(status).json(data);
  }
  let payload;
  try {
    payload = jwt.verify(req.body.refreshToken, secret);
    if (payload.type !== tokens.refresh.type) {
      const status = response.status.UNAUTHORIZED;
      const data = response.dispatch({
        error: [{
          message: 'invalid token!',
        }],
      });
      return res.status(status).json(data);
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      const status = response.status.UNAUTHORIZED;
      const data = response.dispatch({
        error: [{
          message: 'RefreshToken expired!',
        }],
      });
      return res.status(status).json(data);
    }
    const status = response.status.UNAUTHORIZED;
    const data = response.dispatch({
      error: [{
        message: 'Invalid refreshToken!',
      }],
    });
    return res.status(status).json(data);
  }
  try {
    const token = await TokenDAO.fetchOne({ tokenId: payload.id });
    if (token === null) {
      return next({ message: 'invalid token', status: response.status.UNAUTHORIZED });
    }
    const updatedToken = await updateToken(token.userId);
    const data = response.dispatch({
      data: updatedToken,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};
