const { loggers } = require('winston');
const winston = require('winston')

regex = new RegExp('^\\b(?:error|warn|info|debug)\\b$', 'i')

module.exports = winston.createLogger({
    level: regex.test(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL.toLowerCase() : 'info',
    format: winston.format.combine(
        winston.format.colorize({ all: true, colors: { error: 'red', warn: 'yellow', info: 'white'} }),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(info => `${info.timestamp} ${info.message}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
});
