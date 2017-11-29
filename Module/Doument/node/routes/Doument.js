var multer = require('multer');
var moment = require('moment');
var doument = require('../controller/doument');
var db = require('../../../../routes/db.js');
var fs = require('fs');
var express = require('express');
var path = require('path');
module.exports = function(app) {
    app.get('/DocumentManage', doument.documentManageindex);
    app.get('/Knowledge', doument.knowledgeindex);



    var storage = multer.diskStorage({
        //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function(req, file, cb) {
            cb(null, 'Module/Doument/documentFile');
        },
        //给上传文件重命名，获取添加后缀名
        filename: function(req, file, cb) {
            // var fileFormat = (file.originalname).split(".");
            // var name = fileFormat[0] + moment().format('YYYYMMDDHHmmss') + "." + fileFormat[fileFormat.length - 1]
            cb(null, file.originalname);
        }
    });
    //添加配置文件到multer对象。
    var upload = multer({
        storage: storage
    });

    app.post('/Document/UpLoadFiles', upload.single('files_name'), function(req, res) {
        var data = {
            PID: req.body.pid,
            DIR_NAME: req.file.filename,
            CREATOR: req.session.user.UserId,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
            MODIFIER: req.session.user.UserId,
            MODIFIY_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
            FILE_SIZE: req.file.size
        }
        var sql = `INSERT INTO dbo.DOCUMENT (
            PID,
            DIR_NAME,
            DIR_TYPE,
            CREATOR,
            CREATE_DATE,
            MODIFIER,
            MODIFIY_DATE,
            FILE_SIZE
        ) 
        VALUES(
            ${data.PID},
            '${data.DIR_NAME}',
            2,
            ${data.CREATOR},
            '${data.CREATE_DATE}',
            ${data.MODIFIER},
            '${data.MODIFIY_DATE}',
            ${data.FILE_SIZE}
        )
        `;

        db.sql(sql, function(err, result) {
            if (!err) {

                db.sql('SELECT TOP(1) DIR_NBR FROM dbo.DOCUMENT ORDER BY CREATE_DATE DESC', function(err, result) {
                    if (!err) {
                        var oldFile = 'Module/Doument/documentFile/' + req.file.filename;
                        var newFile = 'Module/Doument/documentFile/' + result[0].DIR_NBR + '.' + req.file.filename.split('.').splice(-1)[0];
                        fs.rename(oldFile, newFile, function(err) {
                            if (err) return;
                            res.json({
                                Message: '操作成功!',
                                Status: 0
                            })
                        })
                    }
                })

            }
        })
    });

    app.get('/Document/download', function(req, res) {
        var p = req.query;
        res.download('Module/Doument/documentFile/' + p.file, p.name, function(err) {
            if (!err) {}
        });
    })

    app.post('/Document/DocumentmodifyFie', doument.DocumentmodifyFie)

    app.post('/Document/:method', doument.fun);
    app.get('/Document/:method', doument.fun);
}