var path = require('path');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
var db = require('../../../../routes/db.js')
    //加载页面
exports.index = function(req, res) {
    post_argu.permission(req, res, '/ZFJD', 'view', path.resolve(__dirname, '../../web/view/Alarm/index'));
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

exports.getAlarm = function(req, res) {
    var data = req.body;
    var sql = `SELECT * FROM dbo.ALARM_DATA WHERE MAC_NBR=${data.MAC_NBR} AND ALARM_DATE>='${data.START_TIME}' AND ALARM_DATE<'${data.END_TIME}'`;
    db.sql(sql, function(err, result) {
        if (err) {
            res.json({
                Status: -9999,
                Data: null
            })
            return false
        }
        res.json({
            Status: 0,
            Data: result
        })
    })
}