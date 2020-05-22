const events = require('./events');
const logger = require('../lib/logger');
const eventTypes = require('./event-types');
const socketConnect = require('../lib/socket');
const redisDB = require('./redis');

class Socket {
  constructor(server) {
    if (Socket.instance) return Socket.instance;

    this.io = socketConnect(server);
    Socket.instance = this;
    this.emitEvent = this.emitEvent.bind(this);
    this.connect();
  }

  connect() {
    this.io
      .on('connection', (socket) => {
        socket.on(eventTypes.ERROR, logger.error);
        socket.on(eventTypes.DISCONNECT, events.disconnect(socket));
        const { userId } = socket.handshake.query;
        if (userId) {
          events.addUser(socket, userId);
        } else {
          socket.disconnect(true);
        }
      });
  }

  async emitEvent({ userId, eventName, data }) {
    try {
      if (!this.io) {
        logger.debug('socket connection is missing');
        return {
          error: 'socket connection is missing',
        };
      }

      const socketList = await redisDB.getSocketList(userId);

      if (!socketList.length) {
        return {
          error: 'user is not connected',
        };
      }

      this.io.in(`${userId}`).emit(eventName, data);

      return { success: socketList };
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

module.exports = server => new Socket(server);
