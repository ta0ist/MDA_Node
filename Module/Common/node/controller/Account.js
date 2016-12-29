var path = require('path');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');

exports.accountpage = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/account/index'), { menulist: req.session.menu, user: req.session.user });
    }
}

exports.getuser = function(req, res) {
    var para = {};
    para.pinfo = { "PageSize": req.body.PageSize, "PageIndex": req.body.PageIndex };
    para.keyword = req.body.keyword;
    para.userType = req.body.userType;

    request.post({
        url: post_argu.getpath(__filename, 'GetUserPage'),
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: { pinfo: para.pinfo, keyword: para.keyword, userType: para.userType }
    }, function(error, response, body) {
        var result = JSON.parse(body.d);
        res.json({
            Data: result.Data,
            Status: result.StatusCode,
            Message: "成功"
        });
    });

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


//冻结用户
function Switch(res, method, args) {
    var arg;
    for (var i in args) {
        arg = i;
    }
    post_argu.post_argu(res, method, JSON.parse(arg));
}

//删除用户
function DeleteUser(res, method, args) {
    var arg;
    for (var i in args) {
        arg = i;
    }
    post_argu.post_argu(res, method, JSON.parse(arg));
}

//获取账号组
function FindSubGroupByParentIdRecycle(res, method, args) {
    post_argu.post_argu(res, method, args);
}


//获取人员组
function GetAllMemberAndMemberGroup(res, method, args) {
    post_argu.post_argu(res, method, args);
}


//获取人员
function GetKeywordMemberlist(res, method, args) {
    post_argu.post_argu(res, method, args);
}

//获取设备组
function GetAllMachineAndMachineGroup(res, method, args) {
    post_argu.post_argu(res, method, args);
}

//获取设备
function GetKeywordMachinelist(res, method, args) {
    post_argu.post_argu(res, method, args);
}

//添加用户
function AddUser(res, method, args) {
    var para = { userInfo: args, GP_NBR: args.GP_NBR };
    post_argu.post_argu(res, method, para);
}

//修改用户
function ModifyUser(res, method, args) {
    var para = { userInfo: args, GP_NBR: args.GP_NBR };
    post_argu.post_argu(res, method, para);
}

//修改密码
function ResetPassword(res, method, args) {
    var para = { userInfo: args, GP_NBR: args.GP_NBR };
    post_argu.post_argu(res, method, para);
}

//添加用户组
function AddGroup(res, method, args) {
    var para = { GroupInfo: args };
    post_argu.post_argu(res, method, para);
}

//修改用户组
function ModifyGroup(res, method, args) {
    var para = { GroupInfo: args };
    post_argu.post_argu(res, method, para);
}

//删除用户组
function DelGroupWithAccountUsers(res, method, args) {
    var para = { groupid: args.groupID };
    post_argu.post_argu(res, method, args);
}