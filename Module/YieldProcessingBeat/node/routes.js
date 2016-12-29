
var beat = {};
beat.pbeat = require('./routes/pbeat.js');
module.exports = function (app) {
    beat.pbeat(app);
}
