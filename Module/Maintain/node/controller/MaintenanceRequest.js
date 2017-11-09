var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');

exports.MaintenanceRequest = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/MaintenanceRequest/index'));
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

function GetRepairApplayInfos(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Service/Service.asmx/GetRepairApplayInfos';
    post_argu.post_argu(res, url, { pagermodel: args });
}

function AddRepairApplayInfoService(res, method, args, req) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Service/Service.asmx/AddRepairApplayInfoService';
    args.MEM_NBR = req.session.user.UserId;
    post_argu.post_argu(res, url, { applayInfo: args });
}

function DelRepairApplayInfo(res, method, args, req) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Service/Service.asmx/DelRepairApplayInfo';
    post_argu.post_argu(res, url, args);
}

function AddRepairService(res, method, args, req) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Service/Service.asmx/AddRepairService';
    args.MEM_NBR = req.session.user.UserId;
    post_argu.post_argu(res, url, { repairInfo: args });
}

function GetRules(res, method, args, req) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/GetRules';
    post_argu.post_argu(res, url, args);
}

function UpdRules(res, method, args, req) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/UpdRules';
    post_argu.post_argu(res, url, { rules: args });
}