let Smart = {};
Smart.DNC = require('./routes/DNC.js');

module.exports = (app) => {
    Smart.DNC(app);
}