/**
 * Created by qb on 2016/12/13.
 */
var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js');
var post_common = require('../../../../routes/post_argu.js');
var session = require('express-session');
var logger = require('morgan');
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
    post_common.post_argu(res, method, args);
}
//添加菜单
function AddPersonalSetting(res, method, args) {
    post_common.post_argu(res, method, args);
}
//删除菜单
function DeletePersonalSetting(res, method, args, req) {
    var UserId = req.session.user.UserId;
    post_common.post_argu(res, method, args);
}