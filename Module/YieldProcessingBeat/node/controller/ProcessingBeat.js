var path = require('path');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
//加载页面
exports.index = function(req, res) {
    post_argu.permission(req, res, '/pbeat', 'view', path.resolve(__dirname, '../../web/view/pbeat/index'));
}

exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    args.push(method = post_argu.getpath(__filename, req.params.method));
    args.push(req.body);
    doCallback(eval(req.params.method), args, res);

}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

//获取设备和设备组
function GetAllMachineAndMachineGroup(res, method, args) {
    var data = { groupID: 0 }
    post_argu.post_argu(res, method, data);
}
//根据关键字获取设备信息
function GetKeywordMachinelist(res, method, args) {
    var para = { pinfo: args, keyword: args.keyword }
    post_argu.post_argu(res, method, para);
}
//接拍图
function GetLineProcessingBeatChart(res, method, args) {
    var arr = [];
    console.log(args['mac_nbrs[]']);
    if (Object.prototype.toString.call(args['mac_nbrs[]']) === "[object String]") {

        arr.push(args['mac_nbrs[]']);
    } else {
        arr = args['mac_nbrs[]'];
    }

    var para = {
        mac_nbrs: arr,
        startdate: args.startdate,
        enddate: args.enddate,
        querytype: args.querytype,
        is_work_day: args.is_work_day,
        is_gp: args.is_gp
    };

    console.log(para);
    post_argu.post_argu(res, method, para);
}