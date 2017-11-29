/**
 * Created by htc on 2017/11/28.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.DefectiveOutOfTask = function(req, res) {
    post_argu.permission(req, res, '/DefectiveOutOfTask', 'view', path.resolve(__dirname, '../../web/view/DefectiveOutOfTask/index'));
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

function GetWorkOutList(res, method, args) {
    post_argu.post_argu(res, method, { pagemodel: args });
}

//删除
function DelWorkOut(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//新增
function AddWorkOut(res, method, args) {
    post_argu.post_argu(res, method, { model: args });
}
//编辑
function UpdWorkOut(res, method, args) {
    args.CREATE_DATE = format(args.CREATE_DATE, "yyyy/MM/dd HH:mm:ss");
    post_argu.post_argu(res, method, { model: args });
}

//中国标准时间转yyyy-MM-dd hh:mm:ss格式
function format(time, format) {
    var t = new Date(time);
    var tf = function(i) { return (i < 10 ? '0' : '') + i };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}