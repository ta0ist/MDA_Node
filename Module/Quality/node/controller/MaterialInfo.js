/**
 * Created by htc on 2017/11/28.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.MaterialInfo = function(req, res) {
    post_argu.permission(req, res, '/MaterialInfo', 'view', path.resolve(__dirname, '../../web/view/MaterialInfo/index'));
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

function doCallback(fn, args, res, req) {
    fn.apply(this, args);
}

function Lookup(res, method, args) {
    post_argu.post_argu(res, method, { page: args });
}

//删除
function DelMateriel(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//新增
function AddMateriel(res, method, args) {
    post_argu.post_argu(res, method, { model: args });
}
//编辑
function UpdMateriel(res, method, args) {
    post_argu.post_argu(res, method, { model: args });
}