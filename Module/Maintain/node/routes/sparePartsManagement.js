var SparePartsManagement = require('../controller/SparePartsManagement.js');
module.exports = function(app) {
    app.get('/SparePartsManagement', SparePartsManagement.SparePartsManagement);
    app.post('/SparePartsManagement/:method', SparePartsManagement.fun);
    app.get('/SparePartsManagement/:method', SparePartsManagement.fun);
}