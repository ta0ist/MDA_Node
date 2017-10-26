var MaintenanceWrite = require('../controller/MaintenanceWrite.js');
var multer = require('multer');
var moment = require('moment');
var db = require('../../../../routes/db.js');
module.exports = function(app) {
    app.get('/MaintenanceWrite', MaintenanceWrite.MaintenanceWrite);
    //上传
    var storage = multer.diskStorage({
        //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function(req, file, cb) {
            cb(null, 'Module/Maintain/MaintenanceWrite-uploads');
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

    app.post('/MaintenanceWrite/UploadFile', upload.single('files_name'), function(req, res) {
        var filename = req.file.filename;

        var sql = `UPDATE dbo.REPAIR SET DOCUMENT_PATH='${filename}' WHERE REPAIR_NBR=${req.body.RepairNbr}`;

        db.sql(sql, function(err, result) {
            if (!err) {
                res.json({
                    Message: '操作成功!',
                    Status: 0
                })
            }
        })
    })

    app.get('/MaintenanceWrite/yulan', MaintenanceWrite.yulan);
    app.post('/MaintenanceWrite/:method', MaintenanceWrite.fun);
    app.get('/MaintenanceWrite/:method', MaintenanceWrite.fun);
}