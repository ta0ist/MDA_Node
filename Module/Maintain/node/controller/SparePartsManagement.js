var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');

exports.SparePartsManagement = function(req, res) {
    post_argu.permission(req, res, '/Defective', 'view', path.resolve(__dirname, '../../web/view/SparePartsManagement/index'));
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




function GetAllMemberAndMemberGroup(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/Common/Account.asmx/GetAllMemberAndMemberGroup';
    var data = {
        groupID: 0
    }
    post_argu.post_argu(res, url, data);
}


function GetPartByType(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/PartManage.asmx/GetPartByType';
    post_argu.post_argu(res, url, { pageinfo: args });
}

function GetParts(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/PartManage.asmx/GetParts';
    post_argu.post_argu(res, url, { pageInfo: args });
}

function AddPart(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/PartManage.asmx/AddPart';
    args.PART_NBR = 0;
    post_argu.post_argu(res, url, { partInfo: args });
}

function UpdPart(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/PartManage.asmx/UpdPart';
    post_argu.post_argu(res, url, { partInfo: args });
}


function GetAllPartWarnListByName(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/PartManage.asmx/GetAllPartWarnListByName';

    post_argu.post_argu(res, url, { name: null });
}



function ModifyPartWarnConfig(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/PartManage.asmx/ModifyPartWarnConfig';

    post_argu.post_argu(res, url, { partWarnConfigList: args });
}








function GetStocks(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/GetStocks';
    post_argu.post_argu(res, url, { pagermodel: args });
}

function GetRules(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/GetRules';
    post_argu.post_argu(res, url, args);
}

function UpdRules(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/UpdRules';
    post_argu.post_argu(res, url, { rules: args });
}

function AddOutStock(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/AddOutStock';
    post_argu.post_argu(res, url, { stockinfo: args });
}

function AddInStock(res, method, args) {
    var url = 'http://' + config.webIP + ':' + config.webPort + '/Modules/TpmPart/StockManage.asmx/AddInStock';
    post_argu.post_argu(res, url, { stockinfo: args });
}