var path = require('path')
var request = require('request')
var config = require('../../../../routes/config.js')
var post_argu = require('../../../../routes/post_argu.js')
var db = require('../../../../routes/db')
var _ = require('underscore')

exports.index = function(req, res) {
    post_argu.permission(req, res, '/HeatTreament', 'view', path.resolve(__dirname, '../../web/view/HeatTreament/index'));
}
exports.dayin = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    res.render(path.resolve(__dirname, '../../web/view/HeatTreamentPrint/index'), {
        user: req.session.user
    });
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
    var GroupId = args.GroupId
    db.sql('select * from MACHINE_GROUP_INFO where pid = ' + GroupId + ' order by GP_NAME', function(err, result) {
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

//获取即时sv值和pv值
function GetTempNow(res, args) {
    var GroupId = args.GroupId;
    var methods = global.Webservice + '/MachineParameters/Diagnosis.asmx/GetTempNow';
    db.sql('select * from MACHINE_INFO where GP_NBR = ' + GroupId, function(err, result) {
        var maclist = '';
        for (let i = 0; i < result.length; i++) {
            maclist = maclist + result[i].MAC_NBR + ',';
        }
        request.post({
            url: methods,
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: { MAC_NBR: maclist }
        }, function(error, response, body) {
            if (error) {
                res.json({
                    Data: null,
                    Status: -9999,
                    Message: error
                })
            }
            if (body.d) {
                var dd = JSON.parse(body.d);
                global.temp = dd.Data;
                for (let i = 0; i < dd.Data.length; i++) {
                    dd.Data[i].Mac_Name = _.where(result, { 'MAC_NBR': +dd.Data[i].Mac_nbr })[0].MAC_NAME
                }
                res.json({
                    Status: 0,
                    Data: dd.Data
                })
            } else {

                res.json({
                    Data: null,
                    Status: -9999,
                    Message: body.Message
                })
            }
        })
    })
}

//获取前60条温度记录
function GetTempHis(res, args) {
    var MachineId = args.MachineId;
    db.sql('select top 40 MAC_NBR,STORAGE_DATE,PV from FUJI_TEMPERATURE where MAC_NBR = ' + MachineId + ' order by STORAGE_DATE desc', function(err, result) {
        if (err) {
            res.json({
                Data: null,
                Status: -9999,
                Message: err
            })
        } else {

            res.json({
                Data: _.sortBy(result, 'STORAGE_DATE'),
                Status: 0,
            })
        }
    })
}

//图表拿即时pv值
function Line_Temp(res, args) {
    var MachineId = args.machineId;
    var templist = _.where(global.temp, { Mac_nbr: MachineId });
    if (templist.length > 0) {
        res.json({
            Data: { pv: templist[0].machineitems[1].Value, Date: Date.now() },
            Status: 0
        })
    } else {
        res.json({
            Data: null,
            Status: 0
        })
    }
}