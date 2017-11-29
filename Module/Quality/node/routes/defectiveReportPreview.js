/**
 * Created by htc on 2017/11/28.
 */
var DefectiveReportPreview = require('../controller/DefectiveReportPreview.js');
module.exports = function(app) {
    app.get('/DefectiveReportPreview', DefectiveReportPreview.DefectiveReportPreview);
    app.post('/DefectiveReportPreview/:method', DefectiveReportPreview.fun);
    app.get('/DefectiveReportPreview/:method', DefectiveReportPreview.fun);
}