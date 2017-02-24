/**
 * Created by qb on 2016/12/21.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.ProductionPlan = function(req, res) {
    post_argu.permission(req, res, '/ProductionPlan', 'view', path.resolve(__dirname, '../../web/view/ProductionPlan/index'));
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

function getProductionPlanType(res, method, args) {
    post_argu.post_argu(res, method);
}

function GetProductionPlan(res, method, args) {
    post_argu.post_argu(res, method, { pi: args });
}

function getTaskByCraftNbr(res, method, args) {
    post_argu.post_argu(res, method, { crafr_nbr: args.CRAFR_NBR });
}

function AddProductionPlan(res, method, args) {
    post_argu.post_argu(res, method, { pi: args });
}

function ModifyProductionPlan(res, method, args) {
    post_argu.post_argu(res, method, { pi: args });
}

function DeleteProductionPlan(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function changeTask_No(res, method, args) {
    post_argu.post_argu(res, method, { oi: args });
}