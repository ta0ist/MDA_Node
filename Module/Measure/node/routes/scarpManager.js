/**
 * Created by qb on 2016/12/20.
 */
var ScarpManager = require('../controller/ScarpManager.js');
module.exports = function(app) {
    app.get('/ScarpManager', ScarpManager.ScarpManager);
    //app.get('/OutPutIndex',MachineWorkingStatectrl.OutPutIndex);
    app.post('/ScarpManager/:method', ScarpManager.fun);
    app.get('/ScarpManager/:method', ScarpManager.fun);
}