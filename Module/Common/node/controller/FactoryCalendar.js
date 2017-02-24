var path = require('path');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');

exports.fclendarpage = function(req, res) {
    // var t = new Date().getTime();
    post_argu.permission(req, res, '/fcalendar', 'view', path.resolve(__dirname, '../../web/view/fclendar/index'));
    // if (!req.session.user) {
    //     req.session.error = "请先登录";
    //     res.redirect("/login");
    // } else
    //     res.render(path.resolve(__dirname, '../../web/view/fclendar/index'), {
    //         menulist: req.session.menu,
    //         user: req.session.user,
    //         lang: post_argu.getLanguage()
    //     });
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    args.push(method = post_argu.getpath(__filename, req.params.method));
    args.push(req.body);
    doCallback(eval(req.params.method), args, res);

}

function doCallback(fn, args, res) {
    fn.apply(args[1], args);
}

function GetDateStatus(res, method, args) {

    post_argu.post_argu(res, method, args);
}

function GetDateStatus_Model(res, method, args) {

    post_argu.post_argu(res, method, args);
}

function UpdateStatus(res, method, args) {

    post_argu.post_argu(res, method, args);
}