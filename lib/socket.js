const socket = require('socket.io');
const logger = require('../lib/logger');

module.exports = (server) => {
  const io = socket.listen(server);
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr && addr.port}`;
  logger.debug('Socket Listening on %s', bind);
  return io;
};
