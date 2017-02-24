/**
 * Created by qb on 2016/12/2.
 */
var path = require('path');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session')
exports.operationratioformula = function(req, res) {
    post_argu.permission(req, res, '/OperationRatioFormula', 'view', path.resolve(__dirname, '../../web/view/operationratioformula/index'));
    // if (!req.session.user)
    //     res.redirect('/');
    // else {
    //     res.render(path.resolve(__dirname, '../../web/view/operationratioformula/index'), {
    //         menulist: req.session.menu,
    //         user: req.session.user,
    //         lang: post_argu.getLanguage()
    //     });
    // }
    //res.render(path.resolve(__dirname,'../../web/view/operationratioformula/index'),{menulist: req.session.menu})
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    method = post_argu.getpath(__filename, req.params.method);
    //method = config.OperationRatioFormulaService + '/'+ req.params.method;
    args.push(method);
    args.push(req.body);
    args.push(req);
    doCallback(eval(req.params.method), args, res, req);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}
//列表中的的下拉框选择
function GetDropListList(res, method, args) {
    post_argu.post_argu(res, method, { dataValue: "" });
}

//显示所有
function GetStatusData(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//查询
function GetList(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//新增
function AddDynamicBroadFormula(res, method, args, req) {
    var userID = req.session.user.UserId
    data = {
        FORMULA_NAME: args.FORMULA_NAME,
        TYPE: args.TYPE,
        USER_NBR: userID,
        MEMBER: args.MEMBER,
        DENOMINATOR: args.DENOMINATOR,
        DATETIME: new Date()
    };
    post_argu.post_argu(res, method, { dbfi: data });
}
//更新
function UpdateDynamicBroadFormula2(res, method, args, req) {
    var userID = req.session.user.UserId;
    data = {
        FORMULA_NAME: args.FORMULA_NAME,
        TYPE: args.TYPE,
        USER_NBR: userID,
        MEMBER: args.MEMBER,
        DENOMINATOR: args.DENOMINATOR,
        DATETIME: new Date(),
        NOTICE_NBR: args.NOTICE_NBR
    };
    post_argu.post_argu(res, method, { dbfi: data });
}

//删除
function DeleteDynamicBroadFormula(res, method, args) {
    var data = {
        notice_nbr: args.NOTICE_NBR
    }
    post_argu.post_argu(res, method, data);
}