var MaintenanceRecord = require('../controller/MaintenanceRecord.js');
var multer = require('multer');
var moment = require('moment');
var db = require('../../../../routes/db.js');
module.exports = function(app) {
    app.get('/MaintenanceRecord', MaintenanceRecord.MaintenanceRecord);
    //上传
    var storage = multer.diskStorage({
        //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function(req, file, cb) {
            cb(null, 'Module/Maintain/my-uploads');
        },
        //给上传文件重命名，获取添加后缀名
        filename: function(req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            var name = fileFormat[0] + moment().format('YYYYMMDDHHmmss') + "." + fileFormat[fileFormat.length - 1]
            cb(null, name);
        }
    });
    //添加配置文件到multer对象。
    var upload = multer({
        storage: storage
    });
    app.post('/MaintenanceRecord/UploadFile', upload.single('files_name'), function(req, res) {
        var filename = req.file.filename;
        var sql = `UPDATE dbo.MAINTAIN_REPORT SET DOCUMENT_PATH='${filename}' WHERE REPORT_NBR=${req.body.REPORT_NBR}`;
        db.sql(sql, function(err, result) {
            if (!err) {
                res.json({
                    Message: '操作成功!',
                    Status: 0
                })
            }
        })
    });


    app.post('/MaintenanceRecord/:method', MaintenanceRecord.fun);
    app.get('/MaintenanceRecord/:method', MaintenanceRecord.fun);
}