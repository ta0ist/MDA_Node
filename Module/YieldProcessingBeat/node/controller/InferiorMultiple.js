var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_common = require('../../../../routes/post_argu.js');

exports.inferiorMultiple = function(req, res) {
    post_argu.permission(req, res, '/InferiorMultiple', 'view', path.resolve(__dirname, '../../web/view/inferiorMultiple/index'));
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    args.push(method = 'http://' + config.webIP + ':' + config.webPort + '/Modules/InferiorReasonReturn/Interferior.asmx/' + req.params.method);
    args.push(req.body);
    args.push(req)
    doCallback(eval(req.params.method), args, res, req);

}

function doCallback(fn, args, res, req) {
    fn.apply(this, args);
}

function getInferiorReasonDataInitList(res, method, args) {
    var data = {
        pinfo: {
            PageIndex: args.PageIndex,
            PageSize: args.pageSize
        },
        Keywords: args.Keywords,
        date_begin: args.date_begin,
        end_dt: args.end_dt
    }
    post_common.post_argu(res, method, data);

}

function GetAllPartNoList(res, method, args) {
    post_common.post_argu(res, method, args);
}

function ExportExcelChat(res, method, args) {
    var paths = path.resolve('./ExcelFile');
    args.Nodepath = paths;
    post_common.post_argu(res, method, args);
}