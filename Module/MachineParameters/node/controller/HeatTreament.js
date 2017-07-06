var path = require('path')
var request = require('request')
var config = require('../../../../routes/config.js')
var post_argu = require('../../../../routes/post_argu.js')
var db = require('../../../../routes/db')
var _ = require('underscore')
var moment = require('moment')

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
    db.sql('exec Get_FUJI_Detail ' + GroupId, function(err, result) {
        // db.sql('select * from MACHINE_INFO where GP_NBR = ' + GroupId, function(err, result) {
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
                    var templist = _.where(result, { 'MAC_NBR': +dd.Data[i].Mac_nbr });
                    dd.Data[i].Mac_Name = templist[0].MAC_NAME;
                    dd.Data[i].BATCH = templist[0].BATCH;
                    dd.Data[i].MATERIAL = templist[0].MATERIAL;
                    dd.Data[i].YEILD = templist[0].YEILD;
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

//获取前30条温度记录
function GetTempHis(res, args) {
    var MachineId = args.MachineId;
    db.sql('select top 30 MAC_NBR,STORAGE_DATE,PV from FUJI_TEMPERATURE where MAC_NBR = ' + MachineId + ' order by STORAGE_DATE desc', function(err, result) {
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

//设置sv的值
function setValue(res, args) {
    let gp_nbr = args.gp_nbr,
        START_DATE = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
    let sql_insert = "insert FUJI_DETAIL (MAC_NBR,START_DATE,BATCH,MATERIAL,YEILD,MEMO)values(" + gp_nbr + ",'" + START_DATE + "','" + args.data.BATCH + "','" + args.data.MATERIAL + "','" + args.data.YEILD + "','" + args.data.WORK_ORDER + "'" + ")";
    db.sql(sql_insert, function(err, result) {
        if (err) {
            res.json({
                Data: err,
                Status: -999
            })
        }
        res.json({
            Data: {
                BATCH: args.data.BATCH,
                MATERIAL: args.data.MATERIAL,
                YEILD: args.data.YEILD
            },
            Status: 0
        })
    })
}

function SetPV(res, args) {
    let mac_nbr = args.data.Mac_nbr,
        valueaddress = args.type,
        methods = global.Webservice + '/MachineParameters/Diagnosis.asmx/setTemp';
    request.post({
        url: methods,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { mac_nbr: mac_nbr, valueaddress: valueaddress, value: args.data.machineitems[1].Value }
    }, function(err, response, body) {
        if (err) {
            res.json({
                Data: null,
                Status: -9999,
                Message: error
            })
        }
        if (body.d) {
            res.json({
                Data: 0,
                Status: 0
            })
        } else {
            res.json({
                Data: body,
                Status: -999
            })
        }
    })
}

function SetSV(res, args) {
    let mac_nbr = args.data.Mac_nbr,
        valueaddress = args.type,
        methods = global.Webservice + '/MachineParameters/Diagnosis.asmx/setTemp';
    request.post({
        url: methods,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { mac_nbr: mac_nbr, valueaddress: valueaddress, value: args.data.machineitems[0].Value }
    }, function(err, response, body) {
        if (err) {
            res.json({
                Data: null,
                Status: -9999,
                Message: error
            })
        }
        if (body.d) {
            res.json({
                Data: 0,
                Status: 0
            })
        } else {
            res.json({
                Data: body,
                Status: -999
            })
        }
    })
}

function Print(res, args) {
    db.sql('select top 1 * from FUJI_DETAIL where MAC_NBR = ' + args.mac_nbr + ' order by START_DATE desc', function(err, result) {
        if (err) {
            res.json({
                Data: err,
                Status: -9999
            })
        } else {
            res.json({
                Data: result,
                Status: 0
            })
        }
    })
}

//获得历史温度
function PrintTemp(res, args) {
    let Mac_nbr = args.Mac_nbr,
        StartDate = args.StartDate,
        EndDate = moment(args.EndDate).add(1, 'd').format('YYYY-MM-DD');
    var methods = global.Webservice + '/MachineParameters/Diagnosis.asmx/GetHisTemp';
    request.post({
        url: methods,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { mac_nbr: Mac_nbr, Start_Date: StartDate, End_Date: EndDate }
    }, function(err, response, body) {
        if (err) {
            res.json({
                Data: null,
                Status: -9999,
                Message: error
            })
        } else {
            res.json(JSON.parse(body.d));
        }

    })













    // var sql_his_temp = "select PV from fuji_Temperature where MAC_NBR =" + args.Mac_nbr + " and STORAGE_DATE<='" + args.EndDate + "' and STORAGE_DATE>='" + args.StartDate + "'";
    // db.sql(sql_his_temp, function(err, result) {
    //     if (err) {
    //         res.json({
    //             Data: null,
    //             Status: -9999,
    //             Message: error
    //         })
    //     } else {
    //         if (result.length > 0) {
    //             let datalist = [],
    //                 resu = {},
    //                 StartDate_X = moment(args.StartDate).format('X'),
    //                 EndDate_X = moment(moment(args.EndDate).add(1, 'd').format('YYYY-MM-DD')).format('X');
    //             for (let i = StartDate_X; i < EndDate_X; i += 5000) {
    //                 let y = 0,
    //                     Ist = false;
    //                 if (moment(args.StartDate).format('X') - i < 10000) {
    //                     Ist = true;
    //                 }
    //                 if (!Ist) {
    //                     datalist.push(result[y].PV);
    //                     y++;
    //                 } else
    //                     datalist.push(null);
    //             }
    //             resu.Data = datalist;
    //             resu.dataLength = result.length;
    //             resu.pointInterval = 5000;
    //             resu.pointStart = +Date.parse(args.StartDate);
    //             res.json({
    //                 Data: resu,
    //                 Status: 0,
    //             })
    //         } else {
    //             res.json({
    //                 Data: null,
    //                 Status: 0,
    //             })
    //         }

    //     }
    // })
}

//获得历史温度
function PrintTemp_Group(res, args) {
    let gp_nbr = args.gp_nbr,
        StartDate = args.StartDate,
        EndDate = moment(args.EndDate).add(1, 'd').format('YYYY-MM-DD');
    var methods = global.Webservice + '/MachineParameters/Diagnosis.asmx/GetHisTempByGroup';
    request.post({
        url: methods,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { gp_nbr: gp_nbr, Start_Date: StartDate, End_Date: EndDate }
    }, function(err, response, body) {
        if (err) {
            res.json({
                Data: null,
                Status: -9999,
                Message: error
            })
        } else {
            res.json(JSON.parse(body.d));
        }

    })
}
//获取工作令
function GetWorkOrder(res, args) {
    let sql_getworkorder = "select TOP 1 * from FUJI_DETAIL where MAC_NBR=" + args.GroupId + " order by START_DATE DESC";
    db.sql(sql_getworkorder, function(err, result) {
        if (err) {
            res.json({
                Data: err,
                Status: -9999
            })
        } else {
            res.json({
                Data: result,
                Status: 0
            })
        }
    })
}