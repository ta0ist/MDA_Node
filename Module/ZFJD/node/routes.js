var ZFJD = {};
ZFJD.status = require('./routes/status.js');
ZFJD.alarm = require('./routes/alarm.js');
module.exports = function(app) {
    ZFJD.status(app);
    ZFJD.alarm(app);
}