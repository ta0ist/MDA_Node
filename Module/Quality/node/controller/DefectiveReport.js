/**
 * Created by htc on 2017/11/28.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.DefectiveReport = function(req, res) {
    post_argu.permission(req, res, '/DefectiveReport', 'view', path.resolve(__dirname, '../../web/view/DefectiveReport/index'));
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    //var method = config.webMachineWorkingStateService + '/'+ req.params.method;
    var method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);
    args.push(req);
    doCallback(eval(req.params.method), args, res, req);
}

function doCallback(fn, args, res, req) {
    fn.apply(this, args);
}

function GetDefectiveList(res, method, args) {
    post_argu.post_argu(res, method, { pager: args });
}

//删除
function DelDefectiveReport(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//编辑
function UpdDefectiveReport_Upd(res, method, args) {
    var model = JSON.parse(args.reportmodel);
    // model.MEM_NBR = req.session.user.UserId;
    var list = JSON.parse(args.loglist);
    post_argu.post_argu(res, method, { reportmodel: model, loglist: list });
}
//确认返工/返工完成/确认
function UpdDefectiveReport(res, method, args, req) {
    var model = JSON.parse(args.reportmodel);
    model.MEM_NBR = req.session.user.UserId;
    var list = JSON.parse(args.loglist);
    post_argu.post_argu(res, method, { reportmodel: model, loglist: list });
}
//获取次品原因
function GetReportlogList(res, method, args) {
    post_argu.post_argu(res, method, args);
}