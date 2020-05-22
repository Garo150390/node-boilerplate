const express = require('express');

const {
  validateSchema, ajv,
} = require('../../../lib/validation');
const refreshSchema = require('./validate/refresh');

ajv.addSchema(refreshSchema, 'refresh');

const refresh = require('./service');

const refreshRouter = express.Router();

refreshRouter.post('/', validateSchema('refresh'), refresh.refreshTokens);

module.exports = refreshRouter;
