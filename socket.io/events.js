const usersDAO = require('../src/components/users/private/dao.js');
const SocketIo = require('../socket.io');
const logger = require('../lib/logger');
const redisDB = require('./redis');

exports.addUser = async (socket, userId) => {
  try {
    const user = await usersDAO.fetchById(userId);
    if (!user) {
      logger.debug('socket: no such user');
      return socket.disconnect(true);
    }
    await redisDB.addUser(socket.id, user.id);

    socket.join(`${userId}`);
    logger.debug('socket: %s user connected', user.name);
  } catch (e) {
    logger.error('socket addUser error => %j', e);
  }
};

exports.disconnect = socket => async () => {
  logger.debug('socket: user disconnected');
  try {
    await redisDB.deleteUser(socket.id);
  } catch (e) {
    logger.error('socket disconnect error ==> %j', e);
  }
};

exports.sendEvent = async (userId, eventName, data) => {
  try {
    const socket = SocketIo();
    return socket.emitEvent({
      userId,
      eventName,
      data,
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

process.on('SIGINT', async () => {
  try {
    const ok = await redisDB.reset();
    logger.debug('reset redis %s', ok);
    process.exit(1);
  } catch (e) {
    logger.error(e);
  }
});
