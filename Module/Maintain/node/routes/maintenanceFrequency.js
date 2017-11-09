var MaintenanceFrequency = require('../controller/MaintenanceFrequency.js');
module.exports = function(app) {
    app.get('/MaintenanceFrequency', MaintenanceFrequency.MaintenanceFrequency);
    app.post('/MaintenanceFrequency/:method', MaintenanceFrequency.fun);
    app.get('/MaintenanceFrequency/:method', MaintenanceFrequency.fun);
}