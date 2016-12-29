var path = require('path');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var error = require('../../../../routes/error.js');
var post_argu = require('../../../../routes/post_argu.js');

exports.statusdatapage = function (req, res) {
    if(!req.session.user)
        res.redirect('/');
    res.render(path.resolve(__dirname, '../../web/view/statusdata/index'), { menulist: req.session.menu,user:req.session.user });
}


//处理事件
exports.fun = function (req, res) {
    var args = [];
    args.push(res);
    method = post_argu.getpath(__filename,req.params.method);
    args.push(method);
    args.push(req.body);
    doCallback(eval(req.params.method), args, res);
}

function doCallback(fn, args, res) {
    fn.apply(args[1], args);
}

//获取状态信息
function GetStatusData(res, method, args) {
    post_argu.post_argu(res, method);
}

//删除状态信息
function DeleteStatus(res, method, args) {
    var arg;
    for (var i in args) {
        arg = i;
    }
    post_argu.post_argu(res, method,JSON.parse(arg));
}

//新增状态信息
function NewStatus(res, method, args) {
    post_argu.post_argu(res, method, args);
}

//更新信息
function UpdateStatusData(res, method, args){
    post_argu.post_argu(res, method, args);
}



