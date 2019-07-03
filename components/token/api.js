const express = require('express');

const refresh = require('./service');

const refreshRouter = express.Router();


refreshRouter.post('/', refresh.refreshTokens);

module.exports = refreshRouter;
