var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');



exports.MaintenanceRecord = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/MaintenanceRecord/index'));
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

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

function GetAllMaintainRecoredList(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/GetAllMaintainRecoredList';
    post_argu.post_argu(res, url, { pageMode: args });
}

function ModifyMaintainRecord(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/ModifyMaintainRecord';
    post_argu.post_argu(res, url, { maintainRecord: args });
}


function GetRules(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/GetRules';
    post_argu.post_argu(res, url, args);
}

function UpdRules(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/UpdRules';
    post_argu.post_argu(res, url, { rules: args });
}