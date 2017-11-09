var request = require('request');
var config = require(__dirname + '/config.js');
var errorcode = require(__dirname + '/error.js');
var path = require('path');
var session = require('express-session');
var async = require('async');
var db = require(__dirname + '/db.js');
var _ = require('underscore');


//提交参数
exports.post_argu = function(res, method, args) {
    request.post({
        url: method,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: args,
    }, function(error, response, body) {
        if (error) {
            res.json({
                Data: null,
                Status: -9999,
                Message: error
            })
        } else {
            if (body.d) {
                var result = JSON.parse(body.d);
                res.json({
                    Data: result.Data,
                    Status: result.StatusCode,
                    Message: errorcode["Return_Code" + result.StatusCode]
                })
            } else {
                res.json({
                    Data: null,
                    Status: -9999,
                    Message: body.Message
                })
            }

        }
    })
}



//获取路径
exports.getpath = function(_path, method) {
    var pt = _path.split('\\');
    return global.Webservice + '/' + pt[pt.length - 4] + '/' + pt[pt.length - 1].split('.')[0] + '.asmx/' + method;
}

//获取语言
exports.getLanguage = function() {
    if (!session.language)
        session.language = 'cn.js';
    return require('../public/language/' + session.language);
}

//检查权限
exports.permission = function(req, res, per_id, type, method, args) {
    if (!req.session.user) {
        req.session.error = "请先登录";
        res.redirect("/login");
    }

    if (req.session.user.UserId == 10) {
        if (type == 'view') {
            res.render(method, {
                menulist: req.session.menu,
                user: req.session.user,
                lang: this.getLanguage()
            })
        } else {
            post_argu(res, method, args);
        }
    } else {
        var user_id = req.session.user.UserId;
        fun_per(req, res, user_id, per_id, type, method, args, this);
    }
}


//递归返回
function Get_F_(Data, id, list, type) {
    if (type == 1)
        var Group = _.where(Data, { 'userid': id });
    else
        var Group = _.where(Data, { 'GP_NBR': id });
    if (Group.length > 0) {
        list.push({ id: id, type: type });
        list = Get_F_(Data, Group[0].PID, list, 2);
    } else {
        return list;
    }
}


//获取字符串列表
function gp_list(list) {
    var str;
    for (var i = 0; i < list.length; i++) {
        if (i == 0) {
            str = list[i].id;
            // } else if (i == list.length) {
            //     str = str + ',' + list[i - 1].id;
        } else {
            str = str + ',' + list[i].id;
        }
    }
    return str;
}

//函数权限(user_id:用户ID,routes:路由,type：页面属性（1：view,2:其他），method：(方法或者路径)，args：(参数),e:元页面)
function fun_per(req, res, user_id, routes, type, method, args, e) {
    async.waterfall([
        function(callback) {
            var sql_command = "select * from (select USER_NBR,permission_nbr,PERMISSION,(case when MENU_URL=null then Function_Name else MENU_URL end) as rount from USER_FUNCTION uf left join MENU_PERMISSION mp on mp.Permission_Nbr = uf.FUNC_NBR left join MENU me on me.MENU_NBR = mp.Menu_Nbr) tmp where USER_NBR=" + user_id + " and rount='" + routes + "'";
            db.sql(sql_command, function(err, result) {
                // })
                // db.sql('select * from USER_FUNCTION uf left join MENU_PERMISSION mp on uf.FUNC_NBR = mp.Permission_Nbr left join MENU on MENU.MENU_NBR = mp.Menu_Nbr where USER_NBR = ' + user_id + ' and MENU_URL = ' + routes, function(err, result) {
                if (err) {
                    console.log(err);
                    res.send({
                        Status: -9999,
                        Message: err
                    })
                }
                if (result.length > 0) {
                    if (result[0].PERMISSION == 1) {
                        if (type == 'view') {
                            res.render(method, {
                                menulist: req.session.menu,
                                user: req.session.user,
                                lang: e.getLanguage()
                            })
                        } else {
                            post_argu(res, method, args);
                        }
                    } else {
                        //return false;
                        res.json({
                            Status: 3,
                            Message: '没有权限'
                        })
                    }

                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            var sql_command = "select gi.*,ur.USER_NBR from GROUP_INFO gi left join USER_GROUP ur on gi.GP_NBR = ur.GP_NBR";
            db.sql(sql_command, function(err, result) {
                if (err) {
                    console.log(err);
                    res({ Status: -1, Message: "连接失败！" });
                }
                var temp = _.where(result, { 'USER_NBR': user_id });
                var g_id;
                if (temp.length > 0) {
                    g_id = _.where(result, { 'USER_NBR': user_id })[0].GP_NBR;
                } else {}
                var g_list = [];
                Get_F_(result, g_id, g_list, 2);
                callback(null, g_list);
            })
        },
        function(g_list, callback) {
            var gr = gp_list(g_list);
            db.sql("select * from (select GP_NBR,permission_nbr,PERMISSION,(case when MENU_URL=null then Function_Name else MENU_URL end) as rount from GROUP_FUNCTION uf left join MENU_PERMISSION mp on mp.Permission_Nbr = uf.FUNC_NBR left join MENU me on me.MENU_NBR = mp.Menu_Nbr) tmp where GP_NBR in (" + gr + ") and rount='" + routes + "'", function(err, result) {
                if (err) {
                    console.log(err);
                    res({ Status: -1, Message: "连接失败！" });
                }
                for (var i = 0; i < g_list.length; i++) {
                    var temp = _.where(result, { 'GP_NBR': g_list[i].id });
                    if (temp.length > 0) {
                        if (temp[0].PERMISSION == 1) {
                            if (type == 'view') {
                                res.render(method, {
                                    menulist: req.session.menu,
                                    user: req.session.user,
                                    lang: e.getLanguage()
                                })
                                return;
                            } else {
                                post_argu(res, method, args);
                                return;
                            }
                        } else {
                            res.json({
                                Status: 3,
                                Message: '没有权限'
                            });
                        }
                    }
                    if (i == g_list.length - 1) {
                        res.json({
                            Status: 3,
                            Message: '没有权限'
                        });
                    }
                }
            })
        }
    ])

}

exports.stringFormat = (args) => {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    　　　　　　　　　　　　
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

//获取IP
exports.GetIP = (IP) => {
    let ip = IP.split(':');
    return ip[ip.length - 1] == 1 ? config.Notice.webscoketIP : ip[ip.length - 1];
}