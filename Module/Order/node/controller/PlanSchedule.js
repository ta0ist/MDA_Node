/**
 * Created by qb on 2016/12/20.
 */
var path=require('path');
var config=require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.PlanSchedule=function(req,res){
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/planSchedule/index'), {
            menulist: req.session.menu,
            user:req.session.user ,
            lang: post_argu.getLanguage()
        });
    }
}
exports.fun=function(req,res){
    var args=[];
    args.push(res);
    //var method = config.webMachineWorkingStateService + '/'+ req.params.method;
    var method = post_argu.getpath(__filename,req.params.method);
    args.push(method);
    args.push(req.body);
    args.push(req);
    doCallback(eval(req.params.method),args,res,req);
}
function doCallback(fn,args,res) {
    fn.apply(this, args);
}
function getProcessScheduleByPlan(res,method,args){

    post_argu.post_argu(res,method,args);
}

function getPlanSchedule(res,method,args){

    post_argu.post_argu(res,method,{pm:args});
}
function getDetailByProcess(res,method,args){

    post_argu.post_argu(res,method,args);
}