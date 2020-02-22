const winston = require('winston');

module.exports = winston.createLogger({
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

