var Maintain = {}
Maintain.maintenancePlan = require('./routes/maintenancePlan.js');
Maintain.maintenanceRecord = require('./routes/maintenanceRecord.js');
Maintain.maintenanceRequest = require('./routes/maintenanceRequest.js');
Maintain.MaintenanceWrite = require('./routes/MaintenanceWrite.js');
Maintain.SparePartsManagement = require('./routes/SparePartsManagement.js');
Maintain.FaultTime = require('./routes/FaultTime.js');
Maintain.FaultCause = require('./routes/FaultCause.js');
Maintain.FaultIs = require('./routes/FaultIs.js');
Maintain.MaintenanceFrequency = require('./routes/MaintenanceFrequency.js');
module.exports = function(app) {
    Maintain.maintenancePlan(app);
    Maintain.maintenanceRecord(app);
    Maintain.maintenanceRequest(app);
    Maintain.MaintenanceWrite(app);
    Maintain.SparePartsManagement(app);
    Maintain.FaultTime(app);
    Maintain.FaultCause(app);
    Maintain.FaultIs(app);
    Maintain.MaintenanceFrequency(app);
}