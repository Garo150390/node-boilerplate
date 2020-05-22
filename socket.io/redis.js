const redis = require('../lib/redis_connect');

exports.addUser = (socketId, userId) => {
  if (redis.status === 'ready') {
    redis.hset('socket', socketId, userId);
    redis.lpush(userId, socketId);
  }
  return Promise.reject('Redis not connected');
};

exports.deleteUser = async (socketId) => {
  try {
    if (redis.status === 'ready') {
      const userId = await redis.hget('socket', socketId);
      redis.hdel('socket', socketId);
      await redis.lrem(userId, 100, socketId);
      return redis.llen(userId);
    }
    return Promise.reject('Redis not connected');
  } catch (e) {
    return Promise.reject(e);
  }
};

exports.getUserId = async (socketId) => {
  if (redis.status === 'ready') {
    const userId = await redis.hget('socket', socketId);
    const userConnections = await redis.llen(userId);
    return { userId, userConnections };
  }
  return Promise.reject('Redis not connected');
};

exports.getSocketList = async (userId) => {
  try {
    if (redis.status === 'ready') {
      return redis.lrange(userId, 0, -1);
    }
    return Promise.reject('Redis not connected');
  } catch (e) {
    return e;
  }
};

exports.reset = () => {
  if (redis.status === 'ready') {
    redis.flushdb();
  }
  return 'ok';
};
