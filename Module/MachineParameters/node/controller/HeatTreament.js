var path = require('path')
var request = require('request')
var config = require('../../../../routes/config.js')
var post_argu = require('../../../../routes/post_argu.js')
var db = require('../../../../routes/db')

exports.index = function(req, res) {
    post_argu.permission(req, res, '/HeatTreament', 'view', path.resolve(__dirname, '../../web/view/HeatTreament/index'));
}
exports.dayin = function(req, res) {
    res.render(path.resolve(__dirname, '../../web/view/HeatTreamentPrint/index'));
}

exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    args.push(req.body);
    doCallback(eval(req.params.method), args, res);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

//获取热处理炉
function GetMachinesByGourpId(res, args) {
    db.sql('select * from MACHINE_GROUP_INFO where pid = 23', function(err, result) {
        if (err) {
            res.json({
                Data: err,
                Status: -9999
            })
        }
        res.json({
            Data: result,
            Status: 0
        })
    })
}