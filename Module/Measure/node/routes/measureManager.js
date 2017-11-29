/**
 * Created by qb on 2016/12/20.
 */
var MeasureManager = require('../controller/MeasureManager.js');
module.exports = function(app) {
    app.get('/MeasureManager', MeasureManager.MeasureManager);
    //app.get('/OutPutIndex',MachineWorkingStatectrl.OutPutIndex);a
    app.post('/MeasureManager/:method', MeasureManager.fun);
    app.get('/MeasureManager/:method', MeasureManager.fun);



}