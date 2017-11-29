/**
 * Created by htc on 2017/11/28.
 */
var DefectiveReport = require('../controller/DefectiveReport.js');
module.exports = function(app) {
    app.get('/DefectiveReport', DefectiveReport.DefectiveReport);
    app.post('/DefectiveReport/:method', DefectiveReport.fun);
    app.get('/DefectiveReport/:method', DefectiveReport.fun);
}