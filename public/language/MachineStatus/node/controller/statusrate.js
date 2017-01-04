/**
 * Created by qb on 2016/11/28.
 */
var path = require('path');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
exports.statusrate = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else
        res.render(path.resolve(__dirname, '../../web/view/statusrate/index'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage()
        });
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);

    doCallback(eval(req.params.method), args, res);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}
// 获取设备和设备组
function GetAllMachineAndMachineGroup(res, method, args) {
    var groupID = { groupID: 0 }
    post_argu.post_argu(res, method, groupID);
}
//根据设备组ID获取设备信息
function GetKeywordMachinelist(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//获取设备状态分布数据并以日期进行分组
function GetMachineStatusListByDate(res, method, args) {
    //console.log(args);
    var arr = [];
    if ((typeof args['ObjectIDs[]']) == 'string') {
        arr.push(args['ObjectIDs[]']);
    } else {
        arr = args['ObjectIDs[]'];
    }
    var data = {
        StartTime: args.StartTime,
        EndTime: args.EndTime,
        ShowDetails: args.ShowDetails,
        ObjectIDs: arr
    }
    post_argu.post_argu(res, method, data);
}
//统计子状态的用时比
function GetSunStatusRate(res, method, args) {
    console.log(args)
    var re = [];
    if (args.MAC_NBR_LIST == undefined) {
        if ((typeof args['MAC_NBR_LIST[]']) == 'string') {
            re.push(args['MAC_NBR_LIST[]']);
        } else {
            re = args['MAC_NBR_LIST[]'];
        }

    } else {
        re.push(args.MAC_NBR_LIST);
    }
    var data = {
        beginDate: args.beginDate,
        endDate: args.endDate,
        Isdetail: args.Isdetail,
        MAC_NBR_LIST: re
    }
    post_argu.post_argu(res, method, data);
}
//状态具体内容
function GetMachineStatusDetails(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//获取某一台设备的指定时间段的状态分布数据并以班次进行分组
function GetMachineStatusListByShift(res, method, args) {

    post_argu.post_argu(res, method, args);
}
//获取设备状态分布数据并以设备进行分组
function GetMachineStatusListByName(res, method, args) {
    //console.log(args);
    var arr = [];
    if ((typeof args['ObjectIDs']) == 'string') {
        arr.push(args['ObjectIDs']);
    } else {
        arr = args['ObjectIDs'];
    }
    var data = {
        StartTime: args.StartTime,
        EndTime: args.EndTime,
        ShowDetails: args.ShowDetails,
        ObjectIDs: arr
    }
    post_argu.post_argu(res, method, data);
}
//修改状态描述
function ModifyStatus(res, method, args) {
    console.log(args);
    post_argu.post_argu(res, method, args);
}