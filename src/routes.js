const express = require('express');
const passport = require('../lib/passport');

const refreshRouter = require('./components/token/api');
const usersRouter = require('./components/users/api');
const RS = require('../middleware/request');

const router = express.Router();
router.use(passport.authenticate('custom', { session: false }));
router.use(RS.parseQuery);

router.use('/users', usersRouter);
router.use('/refresh', refreshRouter);

module.exports = router;
