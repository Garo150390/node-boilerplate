const usersDAO = require('../src/components/users/private/dao');
const data = require('./data/users.json');

module.exports = {
  up: async () => {
    try {
      await usersDAO.removeAll();

      return usersDAO.insertMany(data);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: () => {
    try {
      return usersDAO.removeAll();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
