const { loggers } = require('winston');
const winston = require('winston')

regex = new RegExp('^\\b(?:error|warn|info|debug)\\b$', 'i')

module.exports = winston.createLogger({
    level: regex.test(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL.toLowerCase() : 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});
