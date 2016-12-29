/**
 * Created by qb on 2016/11/30.
 */
var path=require('path');
var config=require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
exports.MachineYield=function(req,res){
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/MachineYield/index'), { menulist: req.session.menu,user:req.session.user });
    }
    //res.render(path.resolve(__dirname,'../../web/view/MachineYield/index'),{ menulist: req.session.menu });
}
exports.OutPutIndexYield=function(req,res){

    res.render(path.resolve(__dirname,'../../web/view/MachineYield/OutPutIndex'));
}
exports.fun=function(req,res){
    var args=[];
    args.push(res);
    //var method = config.webMachineYieldctrlService + '/'+ req.params.method;
    var method = post_argu.getpath(__filename,req.params.method);
    args.push(method);
    args.push(req.body);
    doCallback(eval(req.params.method),args,res);
}
function doCallback(fn,args,res) {
    fn.apply(this, args);
}

function GetMachineYieldList(res,method,args){
    var arr_machineList=convenient_tool(args['machineList[]']);
    var arr_menList=convenient_tool(args['menList[]']);
    var data={
        menList:arr_menList,
        machineList:arr_machineList,
        BeginDate:args.BeginDate,
        EndDate:args.EndDate,
        searchtype:args.searchtype
    }
    post_argu.post_argu(res,method,data);
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