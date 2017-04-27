/**
 * Created by qb on 2016/12/13.
 */
var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js');
var post_common = require('../../../../routes/post_argu.js');
var session = require('express-session');
var logger = require('morgan');
var db = require('../../../../routes/db.js');
var _ = require('underscore');
exports.main = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    res.render(path.resolve(__dirname, '../../web/view/main/index'), {
        menulist: req.session.menu,
        user: req.session.user,
        lang: post_common.getLanguage()
    });
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    method = post_common.getpath(__filename, req.params.method);;
    args.push(method);
    args.push(req.body);
    args.push(req);
    doCallback(eval(req.params.method), args, res, req);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

//新增主件
function GetAllWidgetList(res, method, args, req) {
    var UserId = req.session.user.UserId;
    logger('UserId=' + UserId);
    post_common.post_argu(res, method, { UserId: UserId });
}
//小主件 主页面
function GetStatusColorAndCount(res, method, args) {
    post_common.post_argu(res, method, args);
}
//用于首页显示 获取所有设备在当天的状态比例占比图
function GetTodayAllMachineStatusPie(res, method, args) {
    post_common.post_argu(res, method, args);
}
//菜单列表
function GetPersonalSettingList(res, method, args, req) {
    var UserId = req.session.user.UserId;
    post_common.post_argu(res, method, { UserId: UserId });
}
//用于首页显示设备组稼动率
function GetAllMachineGroupActivation(res, method, args) {
    post_common.post_argu(res, method, args);
}
//删除主件
function DeleteWidget(res, method, args, req) {
    var UserId = req.session.user.UserId;
    var data = {
        UserId: UserId,
        typeList: args
    }
    post_common.post_argu(res, method, data);
}
//新增主件
function AddWidget(res, method, args, req) {
    var UserId = req.session.user.UserId;
    var data = {
        UserId: UserId,
        componentList: args
    }
    post_common.post_argu(res, method, data);
}
//获取菜单
function GetMenuInfo(res, method, args) {
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

    // post_common.post_argu(res, method, args);
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
//添加菜单
function AddPersonalSetting(res, method, args, req) {
    post_common.post_argu(res, method, { menuinfo: args, UserId: req.session.user.UserId });
}
//删除菜单
function DeletePersonalSetting(res, method, args, req) {
    var UserId = req.session.user.UserId;
    post_common.post_argu(res, method, args);
}