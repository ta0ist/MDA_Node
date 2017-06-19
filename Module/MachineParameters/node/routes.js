var Diagnosisroute = {};
var HeatTreament = {};
Diagnosisroute.routes = require('./routes/diagnosiss.js');
HeatTreament = require('./routes/HeatTreament.js');
module.exports = function(app) {
    Diagnosisroute.routes(app);

}