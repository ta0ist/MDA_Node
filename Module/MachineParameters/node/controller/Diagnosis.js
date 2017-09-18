var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_common = require('../../../../routes/post_argu.js');
var db = require('../../../../routes/db.js')
var _ = require('underscore');
exports.diagnosispage = function(req, res) {
    post_common.permission(req, res, '/diagnosis', 'view', path.resolve(__dirname, '../../web/view/diagnosisview/index'));
}
exports.diagnosisdetailpage = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    res.render(path.resolve(__dirname, '../../web/view/diagnosisview/indexDetail'), {
        menulist: req.session.menu,
        user: req.session.user,
        lang: post_common.getLanguage()
    });
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    args.push(method = post_common.getpath(__filename, req.params.method));

    args.push(req.body);

    doCallback(eval(req.params.method), args, res);

}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}


function GetMachinesByGourpId(res, method, args) {
    post_common.post_argu(res, method, args);

}

function GetImmediatelyparameter(res, method, args) {

    var para = { machineIds: args.machineIds.split(',') }
    post_common.post_argu(res, method, para);

}

exports.GetMachinePara = (req, res) => {
    let StartTime = req.body.StartTime,
        EndTime = req.body.EndTime;
    let mac_nbr = req.body.ObjectIDs;
    let sql = "select RUNNING_DATE,P_INT1,P_INT2,P_INT3,P_INT4 from MACHINE_PARAMETER_201708 where MAC_NBR=" + mac_nbr + " and RUNNING_DATE>'" + StartTime + "' and RUNNING_DATE<='" + EndTime + "'";
    db.sql(sql, (err, result) => {
        if (err) {
            res.json({
                Status: -9999,
                Data: null
            })
        }
        return res.json({
            Status: 0,
            Data: _.sortBy(result, 'RUNNING_DATE')
        })
    })
}