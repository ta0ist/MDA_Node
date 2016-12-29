/**
 * Created by qb on 2016/12/20.
 */
var path=require('path');
var config=require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
exports.OrderLogin=function(req,res){
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/OrderLogin/index'), { menulist: req.session.menu,user:req.session.user });
    }
    //res.render(path.resolve(__dirname,'../../web/view/MachineWorkingState/index'),{ menulist: req.session.menu });
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

function getWorkOrder(res,method,args){

    post_argu.post_argu(res,method,{pageModel:args});
}
function getWorkOrderLoginDetail(res,method,args){
    post_argu.post_argu(res,method,args);
}
function getSumQualifiedInferioriYByTaskNbr(res,method,args){
    post_argu.post_argu(res,method,args);
}

function UpdWorkOrder(res,method,args){

    post_argu.post_argu(res,method,args);
}
function UpdTaskRecord(res,method,args){
    var data={
        taskinfo:{
            END_DATE:args.END_DATE==''?null:new Date(args.END_DATE),
            INFERIOR_NUM:args.INFERIOR_NUM==''?null:args.INFERIOR_NUM,
            INPUT_NUM:args.INPUT_NUM,
            LOGIN_NBR:args.LOGIN_NBR,
            MAC_NAME:args.MAC_NAME,
            MAC_NBR:args.MAC_NBR,
            MAC_NO:args.MAC_NO,
            MEM_NAME:args.MEM_NAME,
            MEM_NO:args.MEM_NO,
            QUALIFIED_NUM:args.QUALIFIED_NUM==''?null:args.QUALIFIED_NUM,
            REPORT_DATE:args.REPORT_DATE==''?null:new Date(args.REPORT_DATE),
            REPORT_STATE:args.REPORT_STATE==''?null:args.REPORT_STATE,
            START_DATE:new Date(args.START_DATE),
            TARGET_NUM:args.TARGET_NUM,
            TASK_NBR:args.TASK_NBR,
            TASK_NO:args.TASK_NO,
            YIELD:args.YIELD
        }
    }
    post_argu.post_argu(res,method,data);
}
function addTaskRecord(res,method,args){
    var arr=convenient_tool(args['mac_nbrs[]']);
    var data={
        task_nbr:args.task_nbr,
        mac_nbrs:arr
    }
    post_argu.post_argu(res,method,data);
}
function getReason(res,method,args){

    post_argu.post_argu(res,method,args);
}
function machineReport(res,method,args,req){
    var UserId=req.session.user.UserId;
    var arr=[];
    var str='';
    var reg='macprocloglist';
    for(var key in args){
        if(key.indexOf(reg)!=-1){
            str=key
        }
    }
    var num=parseInt(str.match(/\d+/g)[0])+1;
    for(var i=0;i<num;i++){
        var obj={}
        obj.QUALIFIED_TYPE=args['macprocloglist['+i+'][QUALIFIED_TYPE]'];
        obj.NUM=args['macprocloglist['+i+'][NUM]'];
        arr[i]=obj;
    }
    var data={
        taskinfo:{
            END_DATE: new Date(args['taskinfo[END_DATE]']),
            INFERIOR_NUM: args['taskinfo[INFERIOR_NUM]'],
            INPUT_NUM: args['taskinfo[INPUT_NUM]'],
            LOGIN_NBR: args['taskinfo[LOGIN_NBR]'],
            MAC_NAME: args['taskinfo[MAC_NAME]'],
            MAC_NBR: args['taskinfo[MAC_NBR]'],
            MAC_NO: args['taskinfo[MAC_NO]'],
            MEM_NAME: args['taskinfo[MEM_NAME]'],
            MEM_NO: args['taskinfo[MEM_NO]'],
            QUALIFIED_NUM: args['taskinfo[QUALIFIED_NUM]'],
            REPORT_DATE: args['taskinfo[REPORT_DATE]'],
            REPORT_STATE: args['taskinfo[REPORT_STATE]'],
            START_DATE: new Date(args['taskinfo[START_DATE]']),
            TARGET_NUM: args['taskinfo[TARGET_NUM]'],
            TASK_NBR: args['taskinfo[TASK_NBR]'],
            TASK_NO:args['taskinfo[TASK_NO]'],
            YIELD: args['taskinfo[YIELD]']
        },
        macprocloglist:arr,
        UserId:UserId
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

