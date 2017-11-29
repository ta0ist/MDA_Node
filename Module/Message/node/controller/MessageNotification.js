var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
var fs = require('fs');
var request = require('request');
var db = require('../../../../routes/db.js');
var moment = require('moment');

var alarmTime = 100; //5分钟 300秒
exports.MessageNotification = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/MessageNotification/index'));
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


//启动硬件服务
exports.StartService = function(req, res) {
    request.post({
        url: 'http://' + config.webIP + ':' + config.webPort + '/Modules/Notice/Notices.asmx/StartService',
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: req.body,
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var b = JSON.parse(body.d);
            if (b.StatusCode > 0) {
                exports.setConfig(req, res)
            }

        } else {
            res.json({ Status: 1 })
        }
    })
}


//关闭硬件服务
exports.StopService = function(req, res) {
    request.post({
        url: 'http://' + config.webIP + ':' + config.webPort + '/Modules/Notice/Notices.asmx/StopService',
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: "",
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (b.StatusCode > 0) {
                exports.setConfig(req, res)
            }
        } else {
            res.json({ Status: 1 })
        }
    })
}

//获取配置接口
exports.getConfig = function(req, res) {
    getConfigFn(function(data) {
        res.json(JSON.parse(data));
    })
}

//获取配置方法
function getConfigFn(callback) {
    fs.readFile('./Module/Message/config.json', 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        callback && callback(data);


    })
}

//更新配置方法
exports.setConfig = function(req, res) {
    fs.readFile('./Module/Message/config.json', 'utf8', function(err, data) {
        if (err) {
            throw err;
            return false;
        }
        var result = JSON.parse(data);
        if (req.body.type) {
            result.type = req.body.type
        }
        if (req.body.flag) {
            result.flag = req.body.flag
        }

        fs.writeFile('./Module/Message/config.json', JSON.stringify(result), 'utf8', function(err, data) {
            if (err) {
                throw err;
                return false;
            }

            res.json({
                Status: 0
            })
        })


    })

}

//消息发送
function messageSent() {
    var sql = {
        mac_nbr: 'SELECT MAC_NBR FROM dbo.MACHINE_INFO',
    }
    db.sql(sql.mac_nbr, function(err, data) {
        if (err) {
            return
        } else {
            var mac_nbr_arr = [];
            data.forEach(function(v, i) {
                mac_nbr_arr.push(v.MAC_NBR);
            });
            request.post({
                url: 'http://' + config.webIP + ':' + config.webPort + '/Modules/MachineParameters/Diagnosis.asmx/GetImmediatelyparameter',
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: { machineIds: mac_nbr_arr },
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var mac_param = JSON.parse(body.d);
                    //console.log(mac_param)

                    var alarmStatus = 31; //报警状态
                    var arr = []; //保存符合条件的
                    for (var key in mac_param.Data.MAC_DATA) {
                        mac_param.Data.MAC_DATA[key].DATAITEMS.forEach(function(v, i) {
                            if (v.Name == "STD::SubStatus" && v.Value == alarmStatus) {
                                var obj = {
                                    mac_name: mac_param.Data.MAC_DATA[key].MAC_NAME,
                                    time: (function() {
                                        var time = 0;
                                        mac_param.Data.MAC_DATA[key].DATAITEMS.forEach(function(v, i) {
                                                if (v.Name == "STD::StartTime") {
                                                    time = timeDifference(v.Value);
                                                }
                                            })
                                            // console.log(mac_param.Data.MAC_DATA[key])
                                        return time;
                                    })()
                                }
                                arr.push(obj)
                            }
                        })
                    }
                    //console.log(arr)

                    var content = "";
                    var arr1 = (function() {
                        var a = [];
                        arr.forEach(function(v, i) {
                            if (v.time >= alarmTime) {
                                a.push(v);
                                //content += v.mac_name + '机床发生报警,时间超过' + formatSeconds(v.time) + "。";
                            }

                        })
                        return a;
                    })()

                    if (arr1.length == 0) {
                        return false;
                    }

                    arr1.forEach(function(v, i) {
                        content += v.mac_name + '机床发生报警,时间超过' + formatSeconds(v.time) + "。";
                    })


                    getConfigFn(function(json) {
                        //console.log(config)
                        var aa = JSON.parse(json); //配置文件
                        if (aa.type == 1) { //网络
                            networkSend(content)
                        } else if (aa.type == 2) { //硬件
                            if (aa.flag == 1) { //1是开启0是关闭不发送
                                hardwareSend(content)
                            }
                        }

                    })

                }
            })

        }
    })

}

messageSent()


//网络发送
function networkSend(content) {
    request.post({
        url: 'https://sms.yunpian.com/v2/sms/single_send.json',
        // json: true,
        headers: {
            "content-type": "Accept:application/json; charset=utf-8;Content-Type:application/x-www-form-urlencoded;charset=utf-8;",
        },
        // body: {
        //     apikey: 'bcc7226497dcdf34ee970ff2dca980a8',
        //     mobile: 18702120968,
        //     text: content

        // },
        body: 'apikey=bcc7226497dcdf34ee970ff2dca980a8&mobile=18702120968&text=' + content,
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {

        }
    })
}

//硬件发送
function hardwareSend(content) {

    request.post({
        url: 'http://' + "http://192.168.0.153" + ':' + "8018" + '/Modules/Notice/Notices.asmx/SendPhoneMessageByCat',
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: {
            port: 4,
            BaudRate: 57600,
            Parity: 2,
            DataBits: 8,
            StopBits: 0,
            FlowControl: 0,
            casa: "+8613010314500"
        },
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {

        }
    })
}


//维修消息发送
exports.sendMessage = function(req, res) {
    var param = req.body;
    var content = "设备" + param.mac_name + "需要维修，内容为" + param.MEMO;
    getConfigFn(function(json) {
        //console.log(config)
        var aa = JSON.parse(json); //配置文件
        if (aa.type == 1) { //网络
            networkSend(content)
        } else if (aa.type == 2) { //硬件
            if (aa.flag == 1) { //1是开启0是关闭不发送
                hardwareSend(content)
            }
        }

    })
}


function timeDifference(startTime) { //持续时间返回秒
    var d1 = new Date(moment(startTime).format('YYYY-MM-DD HH:mm:ss'));
    var d2 = new Date();
    return parseInt((d2.getTime() - d1.getTime()) / 1000);
}

function formatSeconds(value) { //秒转时分秒
    var theTime = parseInt(value); // 秒  
    var theTime1 = 0; // 分  
    var theTime2 = 0; // 小时  
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
}