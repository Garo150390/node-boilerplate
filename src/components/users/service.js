const response = require('../../../helpers/http/response');
const { updateToken } = require('../token/authToken');
const TokenDAO = require('../token/private/dao');
const { updateObj } = require('../../../utils');
const logger = require('../../../lib/logger');
const userDAO = require('./private/dao');
const nconf = require('../../../config');

exports.createUsers = async (req, res, next) => {
  try {
    const values = req.body;

    const user = await userDAO.fetchOne({ email: req.body.email });

    if (req.file) {
      values.image = `${nconf.get('storagePaths:users').replace('public/', '')}/${req.file.filename}`;
    }

    let insertedUser;
    let status = response.status.CREATED;

    if (user && user.password) {
      status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'User is registered, please enter other email',
        code: status,
      });
      return res.status(status).json(data);
    }

    if (user && !user.password) {
      updateObj(user, values);
      insertedUser = await user.save();
      status = response.status.OK;
    } else {
      insertedUser = await userDAO.insert(values);
    }

    const tokens = await updateToken(insertedUser._id);

    const data = response.dispatch({
      data: { user: insertedUser, tokens },
      code: status,
    });
    return res.status(status).json(data);
  } catch (e) {
    return next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const values = req.body;
    const user = await userDAO.fetchOne({ email: values.email });
    if (!user) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Such user not found',
        code: status,
      });
      return res.status(status).json(data);
    }

    if (!user.checkPassword(req.body.password)) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Wrong password',
        code: status,
      });
      return res.status(status).json(data);
    }

    const tokens = await updateToken(user._id);
    const data = response.dispatch({
      data: { user, tokens },
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    const { id } = req.user;

    await TokenDAO.removeToken(id);
    const data = response.dispatch({});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userDAO.fetchMany();
    const data = response.dispatch({
      data: users.docs,
      count: users.count,
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    const user = await userDAO.fetchById(req.params.id);
    if (!user) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'No such user',
        code: status,
      });
      return res.status(status).json(data);
    }
    const data = response.dispatch({
      data: user,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.updateUsers = async (req, res, next) => {
  try {
    if ('role' in req.body && req.user.role !== 'admin') {
      const status = response.status.FORBIDDEN;
      const data = response.dispatch({
        error: 'Permission denied, role is invariable',
        code: status,
      });
      return res.status(status).json(data);
    }

    let { user } = req;
    if (user.role !== 'member') user = await userDAO.fetchById(req.params.id);

    if (!user) {
      const status = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Such user not found',
        code: status,
      });
      return res.status(status).json(data);
    }

    const update = {
      ...req.body,
    };

    if (req.file) {
      update.image = `images/${req.file.filename}`;
    }

    updateObj(user, update);

    // const updateData = await userDAO.update({ _id: req.params.id }, update);
    const updateData = await user.save();

    const data = response.dispatch({
      data: updateData,
    });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await userDAO.remove(id);
    await TokenDAO.removeToken(req.params.id);

    const status = response.status.NO_CONTENT;
    const data = response.dispatch({
      data: 'DELETED',
      code: status,
    });
    return res.status(status).json(data);
  } catch (e) {
    return next(e);
  }
};
