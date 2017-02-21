var path = require('path');
var config = require('../../../../routes/config.js');
var db = require('../../../../routes/db.js');
var post_argu = require('../../../../routes/post_argu.js');
var _ = require('underscore');
var async = require('async');

exports.index = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/permission/index'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage()
        });
    }
}

exports.P_GetSubMenu = function(req, res) {
    db.sql('select * from MENU where MENU_ENABLE=1', function(err, result) {
        if (err) {
            console.log(err);
            res({ Status: -1, Message: "连接失败！" });
        }
        var menulist = result;
        var menu = [];
        res.json({
            Data: GetSubMenu(menulist, 0, menu),
            Status: 0,
            Message: '操作成功'
        });

    });
}


function GetSubMenu(data, pid, menu) {
    var Menu_Son = _.where(data, { 'MENU_PID': +pid });
    for (var i = 0; i < Menu_Son.length; i++) {
        var menu_Detail = {};
        menu_Detail.expanded = true;
        menu_Detail.icon = Menu_Son[i].MENU_ICO;
        menu_Detail.text = Menu_Son[i].MENU_NAME;
        menu_Detail.url = Menu_Son[i].MENU_URL;
        menu_Detail.id = Menu_Son[i].MENU_NBR;
        menu_Detail.flag = 0;
        menu_Detail.items = [];
        var Menu_Son_son = _.where(data, { 'MENU_PID': +Menu_Son[i].MENU_NBR });
        if (Menu_Son_son.length > 0) {
            menu_Detail.flag = 1;

            menu_Detail.items = GetSubMenu(data, Menu_Son[i].MENU_NBR, menu_Detail.items);
        }
        menu.push(menu_Detail);
    }
    return menu;
}


exports.FindSubUserGroupByParentIdRecycle = function(req, res) {
    var group_id = req.query.GroupId;
    var sql = 'select gi.*,ui.USER_NAME,ui.USER_NBR from GROUP_INFO gi left join USER_GROUP ug on  gi.GP_NBR = ug.GP_NBR left join USER_INFO ui on ui.USER_NBR = ug.USER_NBR';
    db.sql(sql, function(err, result) {
        if (err) {
            console.log(err);
            res({ Status: -1, Message: "连接失败！" });
        }
        var Data = {};
        Data.GroupInfo = [];
        Data.UserInfo = [];
        for (var i = 0; i < result.length; i++) {
            var group = _.where(Data.GroupInfo, { 'GP_NBR': result[i].GP_NBR });
            if (group.length == 0) {
                group = {};
                group.GP_NAME = result[i].GP_NAME;
                group.GP_NBR = result[i].GP_NBR;
                group.PID = result[i].PID;
                group.LEVEL_NBR = result[i].LEVEL_NBR;
                Data.GroupInfo.push(group);
            }
            if (result[i].USER_NBR != null) {
                var user = {};
                user.PID = result[i].GP_NBR;
                user.USER_NAME = result[i].USER_NAME;
                user.USER_NBR = result[i].USER_NBR;
                Data.UserInfo.push(user);
            }
        }
        res.json({
            Data: Data,
            Status: 0,
            Message: '操作成功!'
        })
    })
}


exports.GetUserGroupAccredit = function(req, res, next) {
    var group_id, menu_nbr;
    for (var temp in req.body) {
        group_id = (JSON.parse(temp))['groupId'];
        menu_nbr = (JSON.parse(temp))['function_nbr'];
    }
    async.waterfall([
        function(callback) {
            var sql_command = 'select *,(select PERMISSION from GROUP_FUNCTION gp where mp.Permission_Nbr = gp.FUNC_NBR and gp.GP_NBR =' + group_id + ') as PERMISSION from MENU_PERMISSION mp where mp.Menu_Nbr = ' + menu_nbr;

            // sql_command += sql_command;
            var Data = [];
            db.sql(sql_command, function(err, result) {
                if (err) {
                    console.log(err);
                    res({ Status: -1, Message: "连接失败！" });
                }
                for (var i = 0; i < result.length; i++) {
                    var dr = {};
                    dr.FUNC_NBR = result[i].Permission_Nbr;
                    dr.FUNC_NAME = (result[i].Opertion_Name).trim();
                    if (result[i].PERMISSION == null) {
                        dr.PERMISSION = null;
                        //dr.PERMISSION = Get_F_Per(result[i].GP_NBR, result[i].Permission_Nbr, 2);
                    } else if (result[i].PERMISSION == 3) {
                        dr.PERMISSION = 3;
                    } else {
                        dr.PERMISSION = 1;
                    }
                    // else {
                    //     dr.PERMISSION = 1;
                    // }
                    Data.push(dr);
                }
                callback(null, Data);
            });
        },
        function(data, callback) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].permission == null) {
                    data[i].permission = 1;
                }
            }
            callback(null, data, );
        },
        function(data, callback) {
            res.json({
                Data: data,
                Status: 0,
                Message: '操作成功！'
            })
        }
    ]);




}

exports.GetUserAccredit = function(req, res, next) {
    var user_id, menu_nbr;
    for (var temp in req.body) {
        userId = (JSON.parse(temp))['userId'];
        menu_nbr = (JSON.parse(temp))['function_nbr'];
    }
    var sql_command = 'select *,(select PERMISSION from USER_FUNCTION gp where mp.Permission_Nbr = gp.FUNC_NBR and gp.USER_NBR =' + userId + ') as PERMISSION from MENU_PERMISSION mp where mp.Menu_Nbr = ' + menu_nbr;
    sql_command += sql_command
    db.sql(sql_command, function(err, result) {
        if (err) {
            console.log(err);
            res({ Status: -1, Message: "连接失败！" });
        }
        var Data = [];
        for (var i = 0; i < result.length; i++) {
            var dr = {};
            dr.FUNC_NBR = result[i].Permission_Nbr;
            dr.FUNC_NAME = (result[i].Opertion_Name).trim();
            if (result[i].PERMISSION == null) {
                dr.PERMISSION = Get_F_Per(userId, result[i].Permission_Nbr, 1);
            } else if (result[i].PERMISSION == 3) {
                dr.PERMISSION = 3;
            } else {
                dr.PERMISSION = 1;
            }
            Data.push(dr);
        }
        res.json({
            Data: Data,
            Status: 0,
            Message: '操作成功！'
        })
    });
}

exports.AddGroupFun = function(req, res, next) {
    var data = req.body,
        sql_command, permission;
    db.sql('select * from GROUP_FUNCTION where GP_NBR = ' + data.group + ' and FUNC_NBR=' + data.userFunctions, function(err, result) {
            if (err) {
                console.log(err);
                res({ Status: -1, Message: "连接失败！" });
            }
            if (data.status == 3) {
                permission = 1;
                if (result.length == 0) {
                    sql_command = " INSERT INTO GROUP_FUNCTION (GP_NBR,FUNC_NBR,PERMISSION) VALUES (" + data.group + "," + data.userFunctions + ",1)";
                } else {
                    sql_command = "update GROUP_FUNCTION set PERMISSION=1 where GP_NBR = " + data.group + " and FUNC_NBR=" + data.userFunctions;
                }
            } else {
                permission = 3;
                sql_command = "update GROUP_FUNCTION set PERMISSION=3 where GP_NBR = " + data.group + " and FUNC_NBR=" + data.userFunctions;
            }
            db.sql(sql_command, function(err) {
                if (err) {
                    console.log(err);
                    res({ Status: -1, Message: "连接失败！" });
                }
                res.json({
                    Status: 0,
                    Data: permission
                })
            })
        })
        // if (data.status == 3) {
        //     permission = 1;
        //     sql_command = 'delete from GROUP_FUNCTION where GP_NBR = ' + data.group + ' and FUNC_NBR=' + data.userFunctions;
        //     sql_command += " INSERT INTO GROUP_FUNCTION (GP_NBR,FUNC_NBR,PERMISSION) VALUES (" + data.group + "," + data.userFunctions + ",1)";
        // } else {
        //     permission = 3;
        //     sql_command = 'delete from GROUP_FUNCTION where GP_NBR = ' + data.group + ' and FUNC_NBR=' + data.userFunctions;
        // }
}


exports.AddUserFun = function(req, res, next) {
    var data = req.body,
        sql_command, permission;
    if (data.status == 3) {
        permission = 1;
        sql_command = 'delete from USER_FUNCTION where USER_NBR = ' + data.group + ' and FUNC_NBR=' + data.userFunctions;
        sql_command += " INSERT INTO USER_FUNCTION (USER_NBR,FUNC_NBR,PERMISSION) VALUES (" + data.group + "," + data.userFunctions + ",1)";
    } else {
        permission = 3;
        sql_command = 'delete from USER_FUNCTION where USER_NBR = ' + data.group + ' and FUNC_NBR=' + data.userFunctions;
    }

    db.sql(sql_command, function(err, result) {
        if (err) {
            console.log(err);
            res({ Status: -1, Message: "连接失败！" });
        }
        res.json({
            Status: 0,
            Data: permission
        })
    })
}

//查询父节点权限（TYPE 账号类型1:用户，2:组）
function Get_F_Per(ID, FUN_NBR, type) {
    if (type == 1) {
        db.sql("select *,(select PERMISSION from GROUP_FUNCTION where GP_NBR = ug.GP_NBR and FUNC_NBR=" + FUN_NBR + ") as PERMISSION  from USER_INFO ui inner join USER_GROUP ug on ui.USER_NBR =" + ID, function(err, result) {
            if (err) {
                return 0;
            }
            if (result.length > 0) {
                if (result[0].PERMISSION == null) {
                    Get_F_Per(result[0].GP_NBR, FUN_NBR, 2);
                } else {
                    return result[0].PERMISSION;
                }
            } else {
                return 3;
            }
        })
    } else {
        db.sql("select gi_s.GP_NBR as s_ID,gi_f.*,(select PERMISSION from GROUP_FUNCTION where GP_NBR = gi_f.GP_NBR and FUNC_NBR=" + FUN_NBR + ") as PERMISSION from GROUP_INFO gi_s left join GROUP_INFO gi_f on gi_s.PID = gi_f.GP_NBR where gis.GP_NBR = " + ID, function(err, result) {
            if (err) {
                return 0;
            }
            if (result[0].GP_NBR == null) {
                return 3;
            } else if (result[0].PERMISSION == null) {
                Get_F_Per(result[0].GP_NBR, FUN_NBR, 2);
            } else {
                return result[0].PERMISSION;
            }
        })
    }
}