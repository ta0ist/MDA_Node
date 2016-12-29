
var Diagnosisroute = {};
Diagnosisroute.routes = require('./routes/diagnosiss.js');
module.exports = function (app) {
 Diagnosisroute.routes(app);
}