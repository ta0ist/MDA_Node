var path = require('path');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
var db = require('../../../../routes/db.js')
    //加载页面
exports.index = function(req, res) {
    post_argu.permission(req, res, '/ZFJD', 'view', path.resolve(__dirname, '../../web/view/Status/index'));
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

exports.getMac = function(req, res) {
    var sql = "SELECT MAC_NAME,MAC_NBR,MAC_NO,PHOTO FROM dbo.MACHINE_INFO";
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


function GetTempNow(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/MachineParameters/Diagnosis.asmx/GetTempNow';
    post_argu.post_argu(res, url, args);
}