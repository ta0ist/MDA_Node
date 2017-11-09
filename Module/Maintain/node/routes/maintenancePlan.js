/**
 * Created by qb on 2016/12/21.
 */
var MaintenancePlan = require('../controller/MaintenancePlan.js');
module.exports = function(app) {
    app.get('/MaintenancePlan', MaintenancePlan.MaintenancePlan);
    app.post('/MaintenancePlan/:method', MaintenancePlan.fun);
    app.get('/MaintenancePlan/:method', MaintenancePlan.fun);
}