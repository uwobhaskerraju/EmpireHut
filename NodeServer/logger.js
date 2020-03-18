'use strict';

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'results.log');

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.json(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // format.printf(
    //   info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    // )
  ),
  transports: [new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(
        info =>
          `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
      )
    )
  }),
    new transports.File({ filename })]
});

module.exports = logger;