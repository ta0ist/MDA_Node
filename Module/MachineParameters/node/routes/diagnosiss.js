var diagnosisctrl = require('../controller/Diagnosis.js');

module.exports = function(app) {
    //加载设备管理页面
    app.get('/diagnosis', diagnosisctrl.diagnosispage);
    app.get('/diagnosisdetail', diagnosisctrl.diagnosisdetailpage);
    //app.post('/GetImmediatelyparameter', diagnosisctrl.GetImmediatelyparameter);
    app.post('/diagnosis/:method', diagnosisctrl.fun);

    app.post('file/:filename', function(req, res, next) {
        var fileName = req.params.fileName;
        var filePath = path.join(__dirname, fileName);
        var stats = fs.statSync(filePath);
        if (stats.isFile()) {
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=' + fileName,
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.end(404);
        }
    });

    app.post('/diagnosis/r/GetMachinePara', diagnosisctrl.GetMachinePara);

}