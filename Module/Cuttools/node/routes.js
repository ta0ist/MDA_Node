var cuttools = {};
cuttools.Cut = require('./routes/cut.js');
module.exports = function(app) {
    cuttools.Cut(app);
}