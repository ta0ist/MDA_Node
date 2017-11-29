/**
 * Created by htc on 2017/11/28.
 */
var DefectiveOutOfTaskPrint = require('../controller/DefectiveOutOfTaskPrint.js');
module.exports = function(app) {
    app.get('/DefectiveOutOfTaskPrint', DefectiveOutOfTaskPrint.DefectiveOutOfTaskPrint);
    app.post('/DefectiveOutOfTaskPrint/:method', DefectiveOutOfTaskPrint.fun);
    app.get('/DefectiveOutOfTaskPrint/:method', DefectiveOutOfTaskPrint.fun);
}