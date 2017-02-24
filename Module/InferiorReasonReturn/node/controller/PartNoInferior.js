var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_common = require('../../../../routes/post_argu.js');

exports.partNoInferior = function(req, res) {
    post_argu.permission(req, res, '/PartNoInferior', 'view', path.resolve(__dirname, '../../web/view/partNoInferior/index'));
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

function GetPartNoInferiorInitList(res, method, args) {
    var data = {
        pinfo: {
            PageIndex: args.PageIndex,
            PageSize: args.pageSize
        },
        Keywords: args.Keywords,

    }
    post_common.post_argu(res, method, data);
}

function AddPartNoInferior(res, method, args) {
    var data = {
        pif: {
            INTERRIOR_NUM: parseInt(args.INTERRIOR_NUM),
            INTERROR_REASON: args.INTERROR_REASON,
            PART_INTERRIOR_NBR: 0,
            PART_NO: args.PART_NO,

        }
    }
    post_common.post_argu(res, method, data);
}

function UpdatePartNoInferior(res, method, args) {
    var data = {
        pif: {
            INTERRIOR_NUM: parseInt(args.INTERRIOR_NUM),
            INTERROR_REASON: args.INTERROR_REASON,
            PART_INTERRIOR_NBR: parseInt(args.PART_INTERRIOR_NBR),
            PART_NO: args.PART_NO,
            REPORT_MAN_DATE: args.REPORT_MAN_DATE
        }
    }
    post_common.post_argu(res, method, data);
}

function DeletePartNoInferior(res, method, args) {
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