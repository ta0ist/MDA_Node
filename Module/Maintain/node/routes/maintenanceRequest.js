var MaintenanceRequest = require('../controller/MaintenanceRequest.js');
module.exports = function(app) {
    app.get('/MaintenanceRequest', MaintenanceRequest.MaintenanceRequest);
    app.post('/MaintenanceRequest/:method', MaintenanceRequest.fun);
    app.get('/MaintenanceRequest/:method', MaintenanceRequest.fun);
}