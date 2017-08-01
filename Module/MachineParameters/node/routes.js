var Diagnosisroute = {};
var HeatTreament = {};
var MachinePara = {};
Diagnosisroute.routes = require('./routes/diagnosiss.js');
HeatTreament.routes = require('./routes/HeatTreament.js');
MachinePara.routes = require('./routes/MachinePara.js');
module.exports = function(app) {
    Diagnosisroute.routes(app);
    HeatTreament.routes(app);
    MachinePara.routes(app);
}