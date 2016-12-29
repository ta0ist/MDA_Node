/**
 * Created by qb on 2016/11/29.
 */
var path=require('path');
var config=require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.OnlineOrOfflinectrl=function(req,res){
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/OnlineOrOffline/index'), { menulist: req.session.menu,user:req.session.user });
    }
    //res.render(path.resolve(__dirname,'../../web/view/OnlineOrOffline/index'),{ menulist: req.session.menu });
}

exports.fun=function(req,res){
    var args=[];
    args.push(res);
    //var method = config.OnlineOrOfflineService + '/'+ req.params.method;
    var method = post_argu.getpath(__filename,req.params.method);
    args.push(method);
    args.push(req.body);
    args.push(req);
    doCallback(eval(req.params.method),args,res,req);
}
function doCallback(fn,args,res) {
    fn.apply(this, args);
}
function GetEmployeeUpDownLine(res,method,args,req){
    var userID=req.session.user.UserId;
    var data={
        gp_nbr:args.gp_nbr,
        keywords:args.keywords,
        state:args.state,
        userid:userID
    }
    post_argu.post_argu(res,method,data);
}
//员工上线
function UpLineWeb(res,method,args){
    post_argu.post_argu(res,method,args);
}
//员工下线
function DownLineWeb(res,method,args){
    post_argu.post_argu(res,method,args);
}