var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.FaultIs = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/FaultIs/index'));
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

function GetMachineRepairTime(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmChart/MachineFaultTime.asmx/GetMachineRepairTime';
    post_argu.post_argu(res, url, args);
}

function GetGroupRepairTime(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmChart/MachineFaultTime.asmx/GetGroupRepairTime';
    post_argu.post_argu(res, url, args);
}