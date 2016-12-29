var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_common = require('../../../../routes/post_argu.js');
exports.activationpage = function (req, res) {
    if (!req.session.user)
        res.redirect('/');
    else
        res.render(path.resolve(__dirname, '../../web/view/machineactivation/index'), { menulist: req.session.menu, user: req.session.user });
}


exports.fun = function (req, res) {
    var args = [];
    args.push(res);
    args.push(method = post_common.getpath(__filename, req.params.method));

    args.push(req.body);

    doCallback(eval(req.params.method), args, res);

}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

function GetGroupActivation(res, method, args) {
    var data = {
        machineMode: args.machineMode,
        objectIds: args.objectIds.split(','),
        startTime: args.startTime,
        endTime: args.endTime
    };
    post_common.post_argu(res, method, data);
}

function GetMachineActivation(res, method, args) {
    var data = {
        machineMode: args.machineMode,
        objectIds: args.objectIds.split(','),
        startTime: args.startTime,
        endTime: args.endTime
    };
    post_common.post_argu(res, method, data);
}

exports.OutPutIndex = function (req, res) {
    res.render(path.resolve(__dirname, '../../web/view/machineactivation/index_detail'));
}

exports.MachineActivationDetail = function (req, res) {
    var data;
    for (var temp in req.body) {
        data = JSON.parse(temp);
    }
    data.objectIds = data.objectIds.split(',');
    var method = post_common.getpath(__filename, 'GetMachineActivation');
    post_common.post_argu(res, method, data);
}

exports.GroupActivationDetail = function (req, res) {
    var data;
    for (var temp in req.body) {
        data = JSON.parse(temp);
    }
    data.objectIds = data.objectIds.split(',');
    var method = post_common.getpath(__filename, 'GetGroupActivation');
    post_common.post_argu(res, method, data);

}