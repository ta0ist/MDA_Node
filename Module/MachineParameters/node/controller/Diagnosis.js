var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_common = require('../../../../routes/post_argu.js');
exports.diagnosispage = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    res.render(path.resolve(__dirname, '../../web/view/diagnosisview/index'), {
        menulist: req.session.menu,
        user: req.session.user,
        lang: post_common.getLanguage()
    });
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
// exports.GetImmediatelyparameter = function (req, res) {
//      //var para = { machineIds: req.body.machineIds.split(',') };
//     request.post({ url: config.diagnosisservice + '/GetImmediatelyparameter',  json: true,
//         headers: {
//             "content-type": "application/json",
//         }, body:{machineIds: req.body.machineIds.split(',')}}, function (error, response, body) {
//         // if (body == 'null') {
//         //     res.json({
//         //         Data:null,
//         //         Status: 1,
//         //         Message: "操作失败"
//         //     })
//         // }
//         // else {
//         //     res.json({
//         //          Data:body.d,
//         //         Status: 0,
//         //         Message: "登录成功！"
//         //     })
//         //     //return res.redirect("/");
//         //     //return res.render(path.resolve(__dirname, '../../web/view/login/jade1'));
//         // }
//         res.json(JSON.parse(body.d));
//         })
// }
function GetMachinesByGourpId(res, method, args) {
    post_common.post_argu(res, method, args);

}

function GetImmediatelyparameter(res, method, args) {

    var para = { machineIds: args.machineIds.split(',') }
    post_common.post_argu(res, method, para);

}