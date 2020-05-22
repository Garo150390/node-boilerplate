const fs = require('fs');
const { resolve } = require('path');

const logger = require('../logger');

module.exports = (multer) => {
  return class Upload {
    constructor(storagePath, fileFilter) {
      this.storagePath = resolve(__dirname, '../../', storagePath);
      this.fileFilter = fileFilter instanceof Function
        ? fileFilter
        : (req, file, cb) => {
          const docTypes = ['text/html', 'application/pdf', 'application/msword'];
          if (file.fieldname === 'doc' && !docTypes.includes(file.mimetype)) {
            return cb({ status: 400, message: `Mimetype not allowed` });
          }
          return cb(null, true);
        };
      this.createStorage();
      return this.upload();
    }

    createStorage() {
      if (!fs.existsSync(this.storagePath)) {
        fs.mkdirSync(this.storagePath);
      }
    }

    upload() {
      const self = this;
      const storage = multer.diskStorage({
        destination(req, file, cb) {
          logger.debug('filename =========== %o', file);
          console.log('file ====== ', file);
          cb(null, self.storagePath);
        },
        filename(req, file, cb) {
          logger.debug('filename =========== %o', file);
          console.log('file ====== ', file);
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      });
      return multer({
        storage,
        fileFilter: this.fileFilter,
      });
    }
  };
};
