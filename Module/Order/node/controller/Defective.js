/**
 * Created by qb on 2016/12/21.
 */
var path=require('path');
var config=require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.Defective=function(req,res){
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/Defective/index'), { menulist: req.session.menu,user:req.session.user });
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
function getPlanSchedule(res,method,args){

    post_argu.post_argu(res,method,{PageModel:args});
}
function GetDefectiveRateByDate(res,method,args){

    var data={
        startDate:args.startDate,
        endDate:args.endDate,
        Prod_nbrList:convenient_tool(args['Prod_nbrList[]'])
    }
    post_argu.post_argu(res,method,data);
}
function GetProductList(res,method,args){

    post_argu.post_argu(res,method,{ProNo:0});
}
function GetProductListByKey(res,method,args){

    post_argu.post_argu(res,method,args);
}
function convenient_tool(arr){
    var re=[];
    if((typeof arr)=='string'){
        re.push(arr);
    }else{
        re=arr;
    }
    return re;
}

