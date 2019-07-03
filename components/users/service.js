const validate = require('validate.js');

const UserDAO = require('./private/dao');
const TokenDAO = require('../token/private/dao');
const options = require('./private/validateOptions');
const { updateToken } = require('../token/authToken');
const response = require('../../helpers/http/response');

exports.createUsers = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    const status = response.status.BAD_REQUEST;
    const data = response.dispatch({
      error: [{ message: 'Body required' }],
    });
    return res.status(status).json(data);
  }
  const errors = validate(req.body, options);
  if (errors) {
    const status = response.status.UNPROCESSABLE_ENTITY;
    const data = response.dispatch({ error: errors });
    return res.status(status).json(data);
  }
  try {
    const user = await UserDAO.fetchOne({ email: req.body.email });
    if (user) {
      const status = response.status.UNAUTHORIZED;
      const data = response.dispatch({
        error: [{ email: 'user is registered, please enter other email' }],
      });
      return res.status(status).json(data);
    }
    req.body.address = {
      country: req.body.country,
      city: req.body.city,
    };
    if (req.file) {
      req.body.image = req.file.filename;
    }
    const insertedUser = await UserDAO.insert(req.body);
    const {
      hash,
      salt,
      iteration,
      _v,
      ...cratedUser
    } = insertedUser;
    const tokens = await updateToken(insertedUser._id);
    const data = response.dispatch({
      data: { user: cratedUser, tokens },
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.getUsers = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const users = await UserDAO.fetchMany({}, { limit, offset });
    const newUsers = users.map((user) => {
      user.image = `images/users/${user.image}`;
      return user;
    });
    const data = response.dispatch({ data: newUsers });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getOneUser = async (req, res, next) => {
  if (req.user) {
    req.user.image = `images/users/${req.user.image}`;
    return res.json(req.user);
  }
  try {
    const user = await UserDAO.fetchOne({ _id: req.params.id });
    if (!user) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: [{ message: 'no such user' }],
      });
      return res.status(status).json(data);
    }
    user.image = `images/users/${user.image}`;
    const data = response.dispatch({
      data: user,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.login = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    const status = response.status.BAD_REQUEST;
    const data = response.dispatch({
      error: [{ message: 'Body required' }],
    });
    return res.status(status).json(data);
  }
  const { email: option } = options;
  const errors = validate({ email: req.body.email }, { email: option });
  if (errors) {
    const status = response.status.UNPROCESSABLE_ENTITY;
    const data = response.dispatch({
      error: errors,
    });
    return res.status(status).json(data);
  }
  try {
    const user = await UserDAO.fetchOne({ email: req.body.email });
    if (!user) {
      const status = response.status.UNAUTHORIZED;
      const data = response.dispatch({
        error: [{ email: 'such user not found' }],
      });
      return res.status(status).json(data);
    }
    if (!user.checkPassword(req.body.password)) {
      const status = response.status.UNAUTHORIZED;
      const data = response.dispatch({
        error: [{ password: 'wrong password' }],
      });
      return res.status(status).json(data);
    }
    const {
      hash,
      salt,
      iteration,
      _v,
      ...parsedUser
    } = user;
    const tokens = await updateToken(user._id);
    const data = response.dispatch({
      data: { tokens, user: parsedUser },
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.updateUsers = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    const status = response.status.BAD_REQUEST;
    const data = response.dispatch({
      error: [{ message: 'Body required' }],
    });
    return res.status(status).json(data);
  }
  if ('role' in req.body && req.user.role !== 'admin') {
    const status = response.status.FORBIDDEN;
    const data = response.dispatch({
      error: [{ message: 'permission denied, role is invariable' }],
    });
    return res.status(status).json(data);
  }
  const option = {};
  let errors = {};
  Object.keys(req.body).forEach((el) => {
    if (el in options) {
      option[el] = options[el];
    } else {
      errors[el] = [`${el} is not user property`];
    }
  });
  if (JSON.stringify(errors) !== '{}') {
    const status = response.status.BAD_REQUEST;
    const data = response.dispatch({
      error: errors,
    });
    return res.status(status).json(data);
  }
  errors = validate(req.body, option);
  if (errors) {
    const status = response.status.UNPROCESSABLE_ENTITY;
    const data = response.dispatch({
      error: errors,
    });
    return res.status(status).json(data);
  }
  if ('password' in req.body) {
    req.user.password = req.body.password;
    req.body.salt = req.user.salt;
    req.body.iteration = req.user.iteration;
    req.body.hash = req.user.hash;
  }
  const update = {
    $set: req.body,
  };
  try {
    const updateData = UserDAO.update({ _id: req.params.id }, update);
    const data = response.dispatch({
      data: updateData,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.removeUsers = async (req, res, next) => {
  try {
    const deletedData = await UserDAO.remove({ _id: req.params.id });
    await TokenDAO.removeToken({ userId: req.params.id });
    const data = response.dispatch({
      data: deletedData,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};
