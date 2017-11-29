/**
 * Created by htc on 2017/11/28.
 */
var MaterialInfo = require('../controller/MaterialInfo.js');
module.exports = function(app) {
    app.get('/MaterialInfo', MaterialInfo.MaterialInfo);
    app.post('/MaterialInfo/:method', MaterialInfo.fun);
    app.get('/MaterialInfo/:method', MaterialInfo.fun);
}