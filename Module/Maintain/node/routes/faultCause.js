var FaultCause = require('../controller/FaultCause.js');
module.exports = function(app) {
    app.get('/FaultCause', FaultCause.FaultCause);
    app.post('/FaultCause/:method', FaultCause.fun);
    app.get('/FaultCause/:method', FaultCause.fun);
}