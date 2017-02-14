/**
 * Created by qb on 2016/11/16.
 */
var StatusDetailctrl = require('../controller/StatusDetail.js');
module.exports = function(app) {
    app.get('/StatusDetail', StatusDetailctrl.StatusDetail);
    app.post('/StatusDetail/:method', StatusDetailctrl.fun);
    app.get('/StatusDetail/:method', StatusDetailctrl.fun);
}