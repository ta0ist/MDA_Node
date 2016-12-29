var memberctrl = require('../controller/Menber.js');
var multiparty = require('multiparty'); 
var fs = require('fs');

module.exports = function (app) {

    //加载页面
    app.get('/member', memberctrl.index)

    //获取组
    //app.post('/GetMenberGrouplist', memberctrl.GetMenberGrouplist);


    //各种事件
    app.post('/member/:method', memberctrl.fun);

    app.post('/member/upload/img', function (req, res) {
        var form = new multiparty.Form();
        form.encoding = 'utf-8';
        form.uploadDir = './public/images';
        form.keepExtensions = true; //保留后缀
        form.type = true;
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.send(err);
                return;
            }
            else {
                var dstPath = './public/images/people/NoDefault/' + files['files[]'][0].originalFilename;
                fs.renameSync(files['files[]'][0].path, dstPath); //重命名
                res.send({
                    Status: 0,
                    Message: "操作成功！",
                    Data:files['files[]'][0].originalFilename
                });
            }


        })
    })
}
