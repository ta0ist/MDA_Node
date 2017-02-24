var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_common = require('../../../../routes/post_argu.js');

exports.partNoMatchProgram = function(req, res) {
    post_argu.permission(req, res, '/PartNoMatchProgram', 'view', path.resolve(__dirname, '../../web/view/partNoMatchProgram/index'));
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

function getPartMatchProgramInitList(res, method, args) {
    var data = {
        pinfo: {
            PageIndex: args.PageIndex,
            PageSize: args.PageSize == undefined ? args.pageSize : args.PageSize,

        },
        Keywords: args.Keywords == undefined ? "" : args.Keywords

    }
    post_common.post_argu(res, method, data);
}

function GetAllProgramNoList(res, method, args) {
    post_common.post_argu(res, method, args);
}

function AddPartNoMacthProgram(res, method, args) {
    var data = {
        pif: {
            PROGRAM_NO: args.PROGRAM_NO,
            PART_PRO_NBR: 0,
            PART_NO: args.PART_NO,

        }
    }
    post_common.post_argu(res, method, data);
}

function UpdatePartNoMacthProgram(res, method, args) {
    var data = {
        pif: {
            PROGRAM_NO: args.PROGRAM_NO,
            PART_PRO_NBR: parseInt(args.PART_PRO_NBR),
            PART_NO: args.PART_NO,

        }
    }
    post_common.post_argu(res, method, data);
}

function getPartMatchProgramList(res, method, args) {
    post_common.post_argu(res, method, args);
}

function DeletePartNoMacthProgram(res, method, args) {
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