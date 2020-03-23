'use strict';

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const filename = path.join(logDir, new Date().toISOString().slice(0, 10) + '_error.json');
const infofilename = path.join(logDir, new Date().toISOString().slice(0, 10) + '_info.json');

const logger = createLogger({
  //level: 'info',
  format: format.combine(
    //format.label({ label: path.basename(__filename) }),
    format.json(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // format.printf(
    //   info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    // )
  ),
  transports: [
    new transports.Console(
      {
        //level: 'info',
        format: format.combine(
          format.colorize(),
          format.printf(
            info =>
              `${info.timestamp} ${info.level} : ${info.message}`
          )
        )
      }
    ),
    new transports.File(
      {
        level: 'error',
        name: 'errorjson',
        filename:filename,
        format: format.combine(
          format.json(),
          format.printf(
            error =>
              `{"timestamp":"${error.timestamp}","level":"${error.level}","message": "${error.message}"}`
          )
        )
      }
    )
    ,
    new transports.File(
      {
        name: 'infojson',
        filename:infofilename,
        format: format.combine(
          format.json(),
          format.printf(
            info =>
              `{"timestamp":"${info.timestamp}","level":"${info.level}","message": "${info.message}"}`
          )
        )

      }
    )
  ]
});

module.exports = logger;