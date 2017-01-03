/**
 * Created by qb on 2016/11/23.
 */
var path = require('path');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
exports.Alarm = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    res.render(path.resolve(__dirname, '../../web/view/Alarm/index'), {
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

function GetAllMachineAndMachineGroup(res, method, args) {
    var groupID = { groupID: 0 }
    post_argu.post_argu(res, method, groupID);
}

function GetKeywordMachinelist(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function GetMachineByAlarmInfo(res, method, data) {
    console.log(data)
    var re = {
        MachineIds: data['MachineIds[]'],
        StartTime: data.StartTime,
        EndTime: data.EndTime,
        QueryType: parseInt(data.QueryType)
    }
    post_argu.post_argu(res, method, re);
}

function GetLookupAlarmInfo(res, method, args) {
    post_argu.post_argu(res, method, { pagermodel: args });
}
//修改故障原因
function UpdAlarm(res, method, args) {
    var d = new Date(args.ALARM_DATE);
    var date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    var data = {
        ALARM_DATE: date,
        ALARM_MESSAGE: args.ALARM_MESSAGE,
        ALARM_NBR: args.ALARM_NBR,
        ALARM_NO: args.ALARM_NO,
        ALARM_REASON: args.ALARM_REASON,
        MAC_NAME: args.MAC_NAME,
        MAC_NBR: args.MAC_NBR
    }
    post_argu.post_argu(res, method, { alarminfo: data });
}