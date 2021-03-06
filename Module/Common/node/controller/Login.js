﻿var path = require('path');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var errorcode = require('../../../../routes/error.js');
var request = require('request');
var _ = require('underscore');
var session = require('express-session');
var crypto = require('crypto');
var db = require('../../../../routes/db.js');
var post_argu = require('../../../../routes/post_argu.js');




exports.loginpage = function(req, res) {

    res.render(path.resolve(__dirname, '../../web/view/login/index'), { lang: post_argu.getLanguage() });
}

exports.main = function(req, res, next) {

    if (!req.session.user) {
        req.session.error = "请先登录";
        res.redirect("/login");
    } else if (!req.session.menu) {
        db.sql('select * from MENU where MENU_ENABLE=1', function(err, result) {
                if (err) {
                    console.log(err);
                    res({ Status: -1, Message: "连接失败！" });
                }
                var menulist = result;
                var menu = [];
                GetSubMenu(menulist, 0, menu);
                req.session.menu = menu;
                res.render(path.resolve(__dirname, '../../web/view/main/index'), {
                    menulist: menu,
                    user: req.session.user,
                    lang: post_argu.getLanguage()
                });
            })
            // request.post({ url: post_argu.getpath(__filename, 'LodeMenu') }, function(error, response, body) {
            //     var menulist = JSON.parse(body);
            //     var menu = [];
            //     GetSubMenu(menulist, 0, menu);
            //     req.session.menu = menu;
            //     res.render(path.resolve(__dirname, '../../web/view/main/index'), {
            //         menulist: menu,
            //         user: req.session.user,
            //         lang: post_argu.getLanguage()
            //     });
            //     //res.render('Module/web/view/', { menulist: menu });
            // });
    } else {
        res.render(path.resolve(__dirname, '../../web/view/main/index'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage()
        });

    }

}

exports.checkuser = function(req, res) {
    var IP = post_argu.GetIP(req.ip);
    var md5 = crypto.createHash('md5'),
        pwd = 1;
    var pwd = md5.update(req.body.Pwd).digest('hex');
    let storage = JSON.parse(req.body.storage);
    request.post({ url: post_argu.getpath(__filename, 'AccountLogin'), form: { name: req.body.Name, pwd: pwd } }, function(error, response, body) {
        if (body == 'null') {
            res.json({
                Status: 1,
                Message: "用户名密码错误！"
            })
        } else {
            if (error) {
                res.json({
                    Status: 200,
                    Message: errorcode["Return_Code" + 200]
                })
            } else {
                req.session.user = JSON.parse(body);
                let guid = (storage.UserId == req.session.user.UserId && storage != '' ? storage.guid : require('uuid/v1')());
                if (!guid) {
                    guid = require('uuid/v1')();
                }
                //checkIP(IP, req.session.user.UserId);
                // global.Client.push({
                //     IP: IP,
                //     UserID: req.session.user.UserId,
                //     ClientId: []
                // })
                global.ws.clients.forEach(
                    client => {
                        client.send(JSON.stringify({
                            guid: guid,
                            UserId: req.session.user.UserId
                        }))
                    }
                )
                res.json({
                    Status: 0,
                    Data: { UserId: req.session.user.UserId, guid: guid },
                    Message: "登录成功！"
                })
            }
        }
    })
}

//递归菜单
function GetSubMenu(data, pid, menu) {
    var SubMenu = _.where(data, { "MENU_PID": pid });
    var OrderSubMenu = _.sortBy(SubMenu, "MENU_ORDER");
    if (OrderSubMenu.length > 0) {
        for (var i = 0; i < OrderSubMenu.length; i++) {
            var SubMenuChild = _.where(data, { "MENU_PID": +OrderSubMenu[i].MENU_NBR });
            var son = {};
            menu.push(son);
            son.nbr = OrderSubMenu[i].MENU_NBR;
            if (session.language == 'cn.js')
                son.pagename = OrderSubMenu[i].MENU_NAME;
            else if (session.language == 'en.js')
                son.pagename = OrderSubMenu[i].MENU_NAME_EN;
            else
                son.pagename = OrderSubMenu[i].MENU_NAME_JP;
            son.ico = OrderSubMenu[i].MENU_ICO;
            if (SubMenuChild.length > 0) {
                son.submenu = [];
                GetSubMenu(data, +OrderSubMenu[i].MENU_NBR, son.submenu);
            } else {
                son.submenu = 0;
                son.url = OrderSubMenu[i].MENU_URL;
            }

        }
    }

}

exports.logout = function(req, res) {
    req.session.user = null;
    req.session.menu = null;
    res.redirect('/login');
}

function checkLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        res.redirect('back');
    }
    next();
}

//加载菜单
exports.loadmenu = function(req, res) {
    res.json({
        Status: 0,
        Data: {
            PID: global.pid,
            ID: global.sid
        }
    })
}

//保存菜单
exports.savemenu = function(req, res) {
    if (req.params.id == "pid") {
        global.pid = req.query.id;
        global.sid = null;
    } else {
        global.pid = req.query.pid;
        global.sid = req.query.id;
    }
}

//检测IP冲突
function checkIP(IP, UserID) {
    for (let i = 0; i < global.Client.length; i++) {
        if (global.Client[i].UserID == UserID && global.Client[i].IP != IP) {
            global.ws.clients.forEach(function each(client) {
                if (_.indexOf(global.Client[i].ClientId, client._ultron.id) > -1) {
                    client.send(JSON.stringify({
                        msg: "你的账户已在其他地方登录!"
                    }));
                    global.Client.splice(i, 1);
                    return;
                }
            })
        }
    }
}