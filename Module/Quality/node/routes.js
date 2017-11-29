var Quality = {}
Quality.defectiveReport = require('./routes/defectiveReport.js');
Quality.defectiveReportPreview = require('./routes/defectiveReportPreview.js');
Quality.defectiveOutOfTask = require('./routes/defectiveOutOfTask.js');
Quality.defectiveOutOfTaskPrint = require('./routes/defectiveOutOfTaskPrint.js');
Quality.materialInfo = require('./routes/materialInfo.js');
Quality.pPM = require('./routes/pPM.js');
module.exports = function(app) {
    Quality.defectiveReport(app);
    Quality.defectiveReportPreview(app);
    Quality.defectiveOutOfTask(app);
    Quality.materialInfo(app);
    Quality.pPM(app);
}