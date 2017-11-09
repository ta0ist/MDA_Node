/**
 * Created by qb on 2016/12/21.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.MaintenancePlan = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/MaintenancePlan/index'));
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

function GetMaintencePlanList(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/GetMaintencePlanList';
    post_argu.post_argu(res, url, { pageMode: args });
}


//按关键字获取设备list
function GetKeywordMachinelist(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Common/Machine.asmx/GetKeywordMachinelist';
    post_argu.post_argu(res, method, args);
}


//获取所有的设备组和设备
function GetAllMachineAndMachineGroup(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Common/Machine.asmx/GetAllMachineAndMachineGroup';
    var groupID = { groupID: 0 }
    post_argu.post_argu(res, url, groupID);
}


//新增
function AddMaintainPlan(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/AddMaintainPlan';
    args.MaintainPlan.PLAN_NBR = -1;
    post_argu.post_argu(res, url, args);
}

//编辑
function ModifyMaintainPlan(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/ModifyMaintainPlan';
    post_argu.post_argu(res, url, args);
}

//删除
function DeleteMaintainPlan(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/DeleteMaintainPlan';
    post_argu.post_argu(res, url, args);
}

//执行保养
function AddMaintainRecord(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/AddMaintainRecord';
    post_argu.post_argu(res, url, args);
}
//根据保养单号获取保养计划
function GetMaintainMachineByMaintainNo(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/GetMaintainMachineByMaintainNo';
    post_argu.post_argu(res, url, args);
}

//设备维护保养计划
function GetJiliMaintencePlanList(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Maintain/Maintain.asmx/GetJiliMaintencePlanList';
    post_argu.post_argu(res, url, args);
}