var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.FaultCause = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/FaultCause/index'));
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

function GetFaultData(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmChart/TpmChart.asmx/GetFaultData';
    post_argu.post_argu(res, url, args);
}

//获取设备组
function GetAllMachineAndMachineGroup(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Common/Account.asmx/GetAllMachineAndMachineGroup';
    var data = {
        groupID: 0
    }
    post_argu.post_argu(res, url, data);
}

//获取设备组
function GetGrouplist(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Common/Machine.asmx/GetGrouplist';
    var data = {
        groupID: 0
    }
    post_argu.post_argu(res, url, data);
}

function GetMachineFaultCause(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmChart/FaultCause.asmx/GetMachineFaultCause';
    post_argu.post_argu(res, url, args);
}

function GetGroupFaultCause(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmChart/FaultCause.asmx/GetGroupFaultCause';
    post_argu.post_argu(res, url, args);
}