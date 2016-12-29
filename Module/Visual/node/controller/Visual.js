var path = require('path');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
//加载页面
exports.index = function (req, res) {
    var vpath = path.resolve('./Module/Visual/web/javascripts/VisualDesign.json');
    res.render(path.resolve(__dirname, '../../web/view/visual/index'), { menulist: req.session.menu, vpath: vpath })
}

//处理事件
exports.fun = function (req, res) {
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

//读取配置文件
exports.ReadyFile = function (req, res) {
    var vpath = req.query.path;
    var method = post_argu.getpath(__filename, 'ReadyFile');
    post_argu.post_argu(res, method, { path: vpath });
}

exports.GetStatus = function (req, res) {
    var method = post_argu.getpath(__filename, 'GetStatus');
    post_argu.post_argu(res, method);
}

exports.GetImmediateState = function (req,res) {
    var Page = req.query.Page;
    var method = post_argu.getpath(__filename, 'GetImmediateState');
    post_argu.post_argu(res, method, { Page: Page });
}

exports.GetYieldByProgramRate = function (req, res) {
    var method = post_argu.getpath(__filename, 'GetYieldByProgramRate');
    post_argu.post_argu(res, method);
}


exports.GetMachineHourYield = function (req, res) {
    var method = post_argu.getpath(__filename, 'GetMachineHourYield');
    post_argu.post_argu(res, method);
}

exports.GetMachineShifStatuRate = function (req, res) {
    var Page = req.query.Page;
    var method = post_argu.getpath(__filename, 'GetMachineShifStatuRate');
    post_argu.post_argu(res, method,{ Page: Page });
}

exports.GetShiftActivation = function (req, res) {
    var Page = req.query.Page;
    var method = post_argu.getpath(__filename, 'GetShiftActivation');
    post_argu.post_argu(res, method,{ Page: Page });
}

exports.GetThisShiftStatuRate = function (req, res) {
    var Page = req.query.Page;
    var method = post_argu.getpath(__filename, 'GetThisShiftStatuRate');
    post_argu.post_argu(res, method,{ Page: Page });
}