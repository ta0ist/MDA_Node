/**
 * Created by qb on 2016/12/21.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.ProductMaintenance = function(req, res) {
    post_argu.permission(req, res, '/ProductMaintenance', 'view', path.resolve(__dirname, '../../web/view/ProductMaintenance/index'));
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

function getProductGroup(res, method, args) {
    post_argu.post_argu(res, method, { gp_nbr: args.gp_nbr });
}

function getProductByGroup(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function addProductGroup(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function modifyProductGroup(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function deleteProductGroup(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function deleteProduct(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function addCradt(res, method, args) {
    post_argu.post_argu(res, method, { prod_nbr: args.prod_nbr, bllcrafts: JSON.parse(args.bllcrafts) });
}

function addprocess(res, method, args) {
    post_argu.post_argu(res, method, { craft_nbr: args.craft_nbr, proc_list: JSON.parse(args.proc_list) });

}

function ModiftProcess(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function ModiftCraft(res, method, args) {
    post_argu.post_argu(res, method, { craftmodel: args });
}

function deleteProcess(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function deleteCraft(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function addProduct(res, method, args) {
    // var arr = [];
    // var txt = 'BllCrafts[0][Bllprocess]';
    // var num;
    // for (var key in args) {
    //     if (key.indexOf(txt) != -1) {
    //         num = key
    //     }
    // }

    // var data = {
    //     product: {
    //         GP_NBR: args.GP_NBR,
    //         MEMO: args.MEMO,
    //         PROD_NAME: args.PROD_NAME,
    //         PROD_NBR: args.PROD_NBR,
    //         PROD_NO: args.PROD_NO,
    //         BllCrafts: arr
    //     }
    // }
    args.BllCrafts = JSON.parse(args.BllCrafts);
    post_argu.post_argu(res, method, { product: args });
}

function modifyProduct(res, method, args) {
    post_argu.post_argu(res, method, { prodmodel: args });
}