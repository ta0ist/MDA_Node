/**
 * Created by htc on 2017/11/28.
 */
var DefectiveOutOfTask = require('../controller/DefectiveOutOfTask.js');
module.exports = function(app) {
    app.get('/DefectiveOutOfTask', DefectiveOutOfTask.DefectiveOutOfTask);
    app.post('/DefectiveOutOfTask/:method', DefectiveOutOfTask.fun);
    app.get('/DefectiveOutOfTask/:method', DefectiveOutOfTask.fun);
}