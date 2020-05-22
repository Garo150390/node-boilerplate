const multer = require('multer');

const fileStorage = require('./multer');

module.exports = fileStorage(multer);
