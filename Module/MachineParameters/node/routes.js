var Diagnosisroute = {};
var HeatTreament = {};
Diagnosisroute.routes = require('./routes/diagnosiss.js');
HeatTreament.routes = require('./routes/HeatTreament.js');
module.exports = function(app) {
    Diagnosisroute.routes(app);
    HeatTreament.routes(app);
}