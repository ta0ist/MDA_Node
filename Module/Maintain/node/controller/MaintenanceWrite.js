var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');

exports.MaintenanceWrite = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/MaintenanceWrite/index'));
}

exports.yulan = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/MaintenanceWrite/yulan'));
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
    fn.apply(this, args, req);
}

function GetRepairs(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Service/Service.asmx/GetRepairs';
    post_argu.post_argu(res, url, { pagermodel: args });
}

function UpdRepair(res, method, args, req) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Service/Service.asmx/UpdRepair';
    args.MEM_NBR = req.session.user.UserId;
    post_argu.post_argu(res, url, { repairInfo: args });
}

function GetApplay_NO(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Service/Service.asmx/GetApplay_NO';
    post_argu.post_argu(res, url, args);
}