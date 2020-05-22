const Ajv = require('ajv');

const response = require('../helpers/http/response');
const logger = require('../lib/logger');

const ajv = new Ajv({ allErrors: true });

const errorResponse = (schemaErrors) => {
  logger.debug('validation error => %j', schemaErrors);
  const errors = [];
  schemaErrors.forEach((error) => {
    logger.debug('validate error > %o', error);
    const key = Object.values(error.params)[0];
    errors.push({
      params: key,
      message: error.message,
    });
  });
  return {
    message: 'Validation error',
    errors,
  };
};

const validate = (schemaName, data) => {
  const valid = ajv.validate(schemaName, data);
  if (!valid) {
    return errorResponse(ajv.errors);
  }
  return false;
};

const validateSchema = (schemaName) => {
  return (req, res, next) => {
    const error = validate(schemaName, req.body);
    if (error) {
      logger.debug('req.body => %o', req.body);
      const status = response.status.UNPROCESSABLE_ENTITY;
      const data = response.dispatch({
        errors: error.errors,
        code: status,
      });
      return res.status(status).json(data);
    }
    return next();
  };
};

module.exports = {
  validateSchema, validate, ajv,
};
