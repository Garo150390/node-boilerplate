const path = require('path');
const cors = require('cors');
const express = require('express');
const engine = require('ejs-mate');
const passport = require('passport');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const { localise } = require('./middleware/localise');
const morgan = require('./lib/logger/morgan_config');
const response = require('./helpers/http/response');
const routes = require('./src/routes');
const logger = require('./lib/logger');

const app = express();

app.use(cors());
app.use(morgan);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(passport.initialize());

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(/^(\/en\b|\/am\b|\/ru\b|)/, localise, routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || response.status.INTERNAL_SERVER_ERROR;
  const data = response.dispatch({
    error: err.message || err,
    code: status,
  });
  if (status >= 500) {
    logger.error('app error => %o', err);
  } else {
    logger.debug('app error => %o', err);
  }
  res.status(status).json(data);
});

module.exports = app;
