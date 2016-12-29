
var Efficiencystatistics = {};
Efficiencystatistics.effciency = require('./routes/machineactivation.js');
module.exports = function (app) {
  Efficiencystatistics.effciency(app);
}