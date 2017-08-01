var machinectrl = require('../controller/Machine.js');
var multiparty = require('multiparty');
var fs = require('fs');

module.exports = function(app) {
    //加载设备管理页面
    app.get('/machine', machinectrl.machineload);
    // app.post('/GetGrouplist', machinectrl.GetGrouplist);
    // app.post('/GetMachineList',machinectrl.GetMachineList)
    app.post('/machine/:method', machinectrl.fun)
    app.get('/machine/:method', machinectrl.fun)

    app.post('/machine/upload/img', function(req, res) {
        var form = new multiparty.Form();
        form.encoding = 'utf-8';
        form.uploadDir = './public/images';
        form.keepExtensions = true; //保留后缀
        form.type = true;
        form.parse(req, function(err, fields, files) {
            if (err) {
                res.send(err);
                return;
            } else {
                var dstPath = './public/images/machine/NoDefault/' + files['files[]'][0].originalFilename;
                fs.renameSync(files['files[]'][0].path, dstPath); //重命名
                res.send({
                    Status: 0,
                    Message: "操作成功！",
                    Data: files['files[]'][0].originalFilename
                });
            }


        })
    })
}