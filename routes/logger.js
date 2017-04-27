var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        {
            type: 'dateFile',
            filename: 'logs/access.log',
            pattern: '_yyyy-MM-dd',
            maxLogSize: 1024,
            alwaysIncludePattern: false,
            backups: 4,
            category: 'normal'
        }
    ],
    replaceConsole: true
});

var logger = log4js.getLogger('normal');
logger.setLevel('info');
exports.trace = function(msg) {
    logger.trace(msg);
};
exports.debug = function(msg) {
    logger.debug(msg);
};
exports.info = function(msg) {
    logger.info(msg);
};
exports.error = function(msg) {
    logger.error(msg);
};
exports.warn = function(msg) {
    logger.warn(msg);
};
exports.fatal = function(msg) {
    logger.fatal(msg);
};