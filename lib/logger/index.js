const fs = require('fs');
const winston = require('winston');
const { resolve } = require('path');
require('winston-daily-rotate-file');
const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

const nconf = require('../../config');

const env = nconf.get('NODE_ENV') || 'development';
const logDir = resolve(__dirname, '../../', 'log');

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

winston.addColors({
  error: 'red',
  info: 'cyan',
  debug: 'green',
});

const errorTransport = new (winston.transports.DailyRotateFile)({
  filename: 'error-%DATE%.log',
  dirname: logDir,
  datePattern: 'YYYY-MM',
  zippedArchive: false,
  level: 'error',
  handleExceptions: true,
  maxFiles: '12',
});

/*
const infoTransport = new (winston.transports.DailyRotateFile)({
  filename: 'info-%DATE%.log',
  dirname: logDir,
  datePattern: 'YYYY-MM',
  zippedArchive: true,
  level: 'info',
  handleExceptions: true,
  maxFiles: '1',
});
*/

const debugTransport = new (winston.transports.DailyRotateFile)({
  filename: 'debug-%DATE%.log',
  datePattern: 'YYYY-MM',
  dirname: logDir,
  zippedArchive: true,
  level: 'debug',
  handleExceptions: true,
  maxFiles: '12',
});

const logger = winston.createLogger({
  level: env === 'production' ? 'debug' : 'debug',
  format: winston.format.combine(
    // winston.format.label({ label: path.basename(process.mainModule.filename) }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.printf(info => `${format(utcToZonedTime(info.timestamp, 'Asia/Yerevan'), 'yyyy-MM-dd HH:mm:ss')} ${info.level} ${info.message}`),
  ),
  transports: [errorTransport, debugTransport],
  exitOnError: false,
});

// logger.info = logger.info.bind(logger);
logger.debug = logger.debug.bind(logger);
logger.error = logger.error.bind(logger);

logger.add(new winston.transports.Console({
  format: winston.format.simple(),
  handleExceptions: true,
}));

logger.stream = {
  write(message) {
    logger.debug(message);
  },
};

module.exports = logger;
