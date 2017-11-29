/**
 * Created by htc on 2017/11/24.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.ScarpManager = function(req, res) {
    post_argu.permission(req, res, '/ScarpManager', 'view', path.resolve(__dirname, '../../web/view/ScarpManager/index'));
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

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

function ScarpLookup(res, method, args) {
    post_argu.post_argu(res, method, { pageModel: args });
}