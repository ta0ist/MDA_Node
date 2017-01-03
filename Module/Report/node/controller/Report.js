var path = require('path');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js')
var request = require('request');
var _ = require('underscore');
var session = require('express-session');
var edge = require('edge');
var fs = require('fs');
var post_argu = require('../../../../routes/post_argu.js');
// var helloWorld = edge.func(function () {/*
//     async (input) => { 
//         return ".NET Welcomes " + input.ToString(); 
//     }
// */});

// var report = edge.func(path.join(__dirname, 'ReportServer.cs'));

exports.page = function(req, res) {
    if (!req.session.menu) {
        res.redirect('/');
    }
    res.render(path.resolve(__dirname, '../../web/view/report/index'), {
        menulist: req.session.menu,
        report: path.resolve('./ReportTemplate'),
        user: req.session.user,
        lang: post_argu.getLanguage()
    });
}

//处理事件
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);
    doCallback(eval(req.params.method), args, res);
}

function doCallback(fn, args, res) {
    fn.apply(args[1], args);
}

function GetRepostName(res, method, args) {
    var body = {},
        data = [];
    fs.readdirSync('./ReportTemplate').forEach(function(file) {
        data.push(file.split('.')[0]);
    });
    body.Data = data;
    body.Status = 0;
    body.Message = "上传成功！";
    res.json(body);

}

function GetRepostType(res, method, args) {
    post_argu.post_argu(res, method);
}

exports.GetRepost = function(req, res) {
    var templateName = path.resolve('ReportTemplate/' + req.query.filename);
    var para = {
        filename: req.query.filename,
        filetype: req.query.filetype,
        parameters: req.query.parameters,
        templateName: templateName
    }


    // request(config.report + '/GetRepost?filename='+para.filename+'&filetype='+para.filetype+'&parameters='+para.parameters+'&templateName='+templateName).pipe('para.filename.xlsx');
    request.post({ url: post_argu.getpath(__filename, 'GetRepost'), form: para }, function(error, response, body) {
            if (error) {
                throw error;
            } else {
                // var rs = fs.createReadStream(body);
                // res.pipe(rs);
                // request(…..).pipe(fs.createWriteStream('xxx.xls'))
                res.pipe(body);
            }
        })
        // request.post({ url: config.report + '/GetRepost', form: para}).pipe().on('error',function(err){
        //     console.log(err);
        // });

}