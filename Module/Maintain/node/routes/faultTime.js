var FaultTime = require('../controller/FaultTime.js');
module.exports = function(app) {
    app.get('/FaultTime', FaultTime.FaultTime);
    app.post('/FaultTime/:method', FaultTime.fun);
    app.get('/FaultTime/:method', FaultTime.fun);
}