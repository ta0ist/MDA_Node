var path = require('path');
let fs = require('fs');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
var db = require('../../../../routes/db.js');
var _ = require('underscore');
var moment = require('moment');
let _Intervalid = 0;
//加载页面
exports.index = function(req, res) {
    var vpath = path.resolve('./Module/Visual/web/javascripts/VisualDesign.json');
    // if (_Intervalid == 0) {
    //     _Intervalid = setInterval(() => {
    //         exports.GetImmediatelyparameterByZF()
    //     }, 3000);
    // }
    res.render(path.resolve(__dirname, '../../web/view/visual/index'), { menulist: req.session.menu, vpath: vpath, notice: config.Notice })
}


exports.board = function(req, res) {
    res.render(path.resolve(__dirname, '../../web/view/board/index'))
}

//处理事件
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);
    doCallback(eval(req.params.method), args, res);
}

function doCallback(fn, args, res) {
    fn.apply(args[1], args);
}

//读取配置文件
exports.ReadyFile = function(req, res) {

    // var vpath = req.query.path;
    // var method = post_argu.getpath(__filename, 'ReadyFile');
    // post_argu.post_argu(res, method, { path: vpath });
    //let VisualDesign = require('./Visual/web/javasripts/VisualDesign.json');
    fs.readFile(path.resolve('./Module/Visual/web/javascripts/VisualDesign.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.json({
                Status: -9999
            })
        }
        return res.json({
            Status: 0,
            Data: data
        })
    })


}

exports.GetStatus = function(req, res) {
    var method = post_argu.getpath(__filename, 'GetStatus');
    post_argu.post_argu(res, method);
}

exports.GetImmediateState = function(req, res) {
    var Page = req.query.Page;
    var method = post_argu.getpath(__filename, 'GetImmediateState');
    post_argu.post_argu(res, method, { Page: Page });
}

exports.GetYieldByProgramRate = function(req, res) {
    var method = post_argu.getpath(__filename, 'GetYieldByProgramRate');
    post_argu.post_argu(res, method);
}


exports.GetMachineHourYield = function(req, res) {
    var method = post_argu.getpath(__filename, 'GetMachineHourYield');
    post_argu.post_argu(res, method);
}

exports.GetMachineShifStatuRate = function(req, res) {
    var Page = req.query.Page;
    var method = post_argu.getpath(__filename, 'GetMachineShifStatuRate');
    post_argu.post_argu(res, method, { Page: Page });
}

exports.GetShiftActivation = function(req, res) {
    var Page = req.query.Page;
    var method = post_argu.getpath(__filename, 'GetShiftActivation');
    post_argu.post_argu(res, method, { Page: Page });
}

exports.GetThisShiftStatuRate = function(req, res) {
    var Page = req.query.Page;
    var method = post_argu.getpath(__filename, 'GetThisShiftStatuRate');
    post_argu.post_argu(res, method, { Page: Page });
}

exports.GetImmediatelyparameter = (req, res) => {
    let Page = req.body;
    let method = post_argu.getpath(__filename, 'GetImmediatelyparameter');
    request.post({
        url: method,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { workcode: 'cj01' },
    }, function(error, response, body) {
        if (error) {
            res.json({
                Data: error,
                Status: -9999
            })
        } else {
            if (body.d != undefined) {
                global.para = JSON.parse(body.d).Data.pad_data;
                res.json({
                    Data: null,
                    Status: 0
                })
            }
        }
    })
}

//获取所有机床的状态信息
exports.GetMachineStatus = (req, res) => {
    let macstatus_list = [];
    for (let i = 0; i < global.para.length; i++) {
        let mac = {};
        mac.MAC_NBR = global.para[i].MAC_NBR;
        if (global.para[i].LI.length > 0) {
            let Status = _.where(global.para[i].LI, { 'Name': 'STD::Status' });
            if (Status.length > 0)
                mac.Status = Status[0].Value;
        } else {
            mac.Status = null
        }
        macstatus_list.push(mac);
    }
    res.json({
        Data: macstatus_list,
        Status: 0
    })

}

//获取机械手所有状态
exports.GetRobot = (req, res) => {
    let robot = _.where(global.para, { 'MAC_NBR': '10' });
    if (robot.length > 0) {
        res.json({
            Data: robot,
            Status: 0
        })
    } else {
        res.json({
            Data: null,
            Status: -9999
        })
    }

}


exports.GetImmediatelyparameterByZF = (req, res) => {

    let method = global.Webservice + '/MachineParameters/Diagnosis.asmx/GetTempNow';

    // post_argu.post_argu(res, method, { machineIds: req.query.machineIds.split(',') });
    request.post({
        url: method,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { MAC_NBR: '10,11,12,13,14,15,16,17,18' }
    }, (err, res, body) => {
        if (err) {
            return;
        } else {
            if (body.d != undefined) {
                global.machinepara = JSON.parse(body.d).Data;
            }
        }
    })
}

exports.ZFJD_getAttr = function(req, res) {
    var mac_nbr = req.query.mac_nbr;
    var result = { isEmpty: true };
    if (global.machinepara) {
        global.machinepara.forEach(function(v, i) {
            if (v.Mac_nbr == mac_nbr) {
                result = v;
                result.isEmpty = false;
            }

        })


    }
    res.json(result)
}


exports.noticeindex = (req, res) => {
    post_argu.permission(req, res, '/notice', 'view', path.resolve(__dirname, '../../web/view/notice/index'));
}

function GetAllAutoNewsList(res, method, args) {
    let pagemodel = {
        pagemodel: args
    };
    post_argu.post_argu(res, method, pagemodel);
}

exports.DeleteNews = (req, res) => {
    db.sql('delete from NEWS where NEWS_NBR in(' + req.body.news_nbrlist + ')', (err, result) => {
        if (err) {
            return res.json({
                Status: -9999
            })
        } else {
            return res.json({
                Status: 0,
                Message: '删除成功!'
            })
        }
    })
}

exports.AddNews = (req, res) => {
    let sql_addNews = `INSERT INTO [NEWS]
([GP_NBR]
,[CONTENT]
,[RELEASE_DATE]
,[MEM_NBR]
,[ACTIVE])
VALUES
(1,'${req.body.Content}','${moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')}',${req.session.user.UserId},0
)`;
    db.sql(sql_addNews, (err, result) => {
        if (err) {
            return res.json({
                Status: -9999
            })
        } else {
            return res.json({
                Status: 0,
                Message: '新增成功!'
            })
        }
    })
}

exports.ModifyNews = (req, res) => {
    if (req.body.ACTIVE == 1) {
        db.sql(`update NEWS set Active=0`, (err, result) => {
            db.sql(`update NEWS set Active=${req.body.ACTIVE} where NEWS_NBR=${req.body.NEWS_NBR}`, (err, result) => {
                if (err) {
                    return res.json({
                        Status: -9999
                    })
                } else {
                    return res.json({
                        Status: 0,
                        Message: '修改成功!'
                    })
                }
            })
        })
    } else {
        db.sql(`update NEWS set Active=${req.body.ACTIVE} where NEWS_NBR=${req.body.NEWS_NBR}`, (err, result) => {
            if (err) {
                return res.json({
                    Status: -9999
                })
            } else {
                return res.json({
                    Status: 0,
                    Message: '修改成功!'
                })
            }
        })
    }

}

exports.GetNoticeActive = (req, res) => {
    db.sql('select CONTENT from NEWS where Active=1', (err, result) => {
        if (err) {
            return res.json({
                Status: -9999
            })
        } else {
            return res.json({
                Status: 0,
                Data: result
            })
        }
    })
}