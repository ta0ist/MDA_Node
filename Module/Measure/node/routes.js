var Measure = {}
Measure.measureManager = require('./routes/measureManager.js');
Measure.scarpManager = require('./routes/scarpManager.js');
Measure.measureOutinPut = require('./routes/measureOutinPut.js');
module.exports = function(app) {
    Measure.measureManager(app);
    Measure.scarpManager(app);
    Measure.measureOutinPut(app);
}