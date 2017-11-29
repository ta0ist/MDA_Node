/**
 * Created by htc on 2017/11/28.
 */
var PPM = require('../controller/PPM.js');
module.exports = function(app) {
    app.get('/PPM', PPM.PPM);
    app.post('/PPM/:method', PPM.fun);
    app.get('/PPM/:method', PPM.fun);
}