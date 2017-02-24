var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_common = require('../../../../routes/post_argu.js');

exports.manPartNoProdCount = function(req, res) {
    post_argu.permission(req, res, '/ManPartNoProdCount', 'view', path.resolve(__dirname, '../../web/view/manPartNoProdCount/index'));
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    args.push(method = 'http://' + config.webIP + ':' + config.webPort + '/Modules/InferiorReasonReturn/Interferior.asmx/' + req.params.method);
    args.push(req.body);
    args.push(req)
    doCallback(eval(req.params.method), args, res, req);

}

function doCallback(fn, args, res, req) {
    fn.apply(this, args);
}

function getManPartProdCountInitList(res, method, args) {
    var data = {
        pinfo: {
            PageIndex: args.PageIndex,
            PageSize: args.pageSize
        },
        Keywords: args.Keywords,
        date_begin: null,
        end_dt: null
    }
    post_common.post_argu(res, method, data);
}

function GetAllPartNoList(res, method, args) {
    post_common.post_argu(res, method, args);
}

function AddManPartProdCount(res, method, args) {
    var data = {
        pif: {
            MAN_PART_PRO_COUNT_NBR: 0,
            PART_NO: args.PART_NO,
            PROD_COUNT: parseInt(args.PROD_COUNT)
        }
    }
    post_common.post_argu(res, method, data);
}

function getManPartProdCountList(res, method, args) {
    var data = {
        page: parseInt(args.page),
        pageSize: parseInt(args.pageSize),
        Keywords: args.Keywords,
        date_begin: null,
        end_dt: null
    }
    post_common.post_argu(res, method, data);
}

function UpdateManPartProdCount(res, method, args) {
    var data = {
        pif: {
            MAN_PART_PRO_COUNT_NBR: parseInt(args.MAN_PART_PRO_COUNT_NBR),
            PART_NO: args.PART_NO,
            PROD_COUNT: parseInt(args.PROD_COUNT)
        }
    }
    post_common.post_argu(res, method, data);
}

function DeleteManPartProdCount(res, method, args) {
    var data = {
        li: convenient_tool(args['li[]'])
    }
    post_common.post_argu(res, method, data);
}

function convenient_tool(arr) {
    var re = [];
    if ((typeof arr) == 'string') {
        re.push(arr);
    } else {
        re = arr;
    }
    return re;
}