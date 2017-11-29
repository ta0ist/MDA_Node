/**
 * Created by htc on 2017/11/28.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
var db = require('../../../../routes/db.js');
exports.DefectiveReportPreview = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/DefectiveReport/previewIndex'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage()
        });
    }
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    var method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);
    args.push(req);
    doCallback(eval(req.params.method), args, res, req);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}