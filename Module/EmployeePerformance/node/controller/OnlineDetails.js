/**
 * Created by qb on 2016/11/29.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
exports.OnlineDetails = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/OnlineDetails/index'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage()
        });
    }
    //res.render(path.resolve(__dirname,'../../web/view/OnlineDetails/index'),{ menulist: req.session.menu });
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    //method = config.webOnlineDetailsService + '/'+ req.params.method;
    var method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);

    doCallback(eval(req.params.method), args, res);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

function GetEmployeeUpDownLineDetailed(res, method, args) {
    post_argu.post_argu(res, method, { pagemodel: args });
}