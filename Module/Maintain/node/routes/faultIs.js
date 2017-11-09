var FaultIs = require('../controller/FaultIs.js');
module.exports = function(app) {
    app.get('/FaultIs', FaultIs.FaultIs);
    app.post('/FaultIs/:method', FaultIs.fun);
    app.get('/FaultIs/:method', FaultIs.fun);
}