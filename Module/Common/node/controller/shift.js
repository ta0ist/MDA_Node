/**
 * Created by qb on 2016/11/24.
 */
var path=require('path');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
exports.shift=function(req,res){
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/shift/index'), { menulist: req.session.menu,user:req.session.user });
    }
    //res.render(path.resolve(__dirname,'../../web/view/shift/index'),{menulist: req.session.menu});
}
exports.ArrangeIndex=function(req,res){
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/shift/ArrangeIndex'), { menulist: req.session.menu,user:req.session.user });
    }
    //res.render(path.resolve(__dirname,'../../web/view/shift/ArrangeIndex'),{menulist: req.session.menu});
}
exports.fun = function (req,res) {
    var args = [];
    args.push(res);
    method = post_argu.getpath(__filename,req.params.method);
    args.push(method);
    args.push(req.body);

    doCallback(eval(req.params.method),args,res);
}

function doCallback(fn,args,res)
{
    fn.apply(this, args);
}
// 获取设备和设备组
function GetAllMachineAndMachineGroup(res,method,args){
    var groupID={groupID:0}
    post_argu.post_argu(res,method,groupID);
}
//根据设备组ID获取设备信息
function GetKeywordMachinelist(res,method,args){
    post_argu.post_argu(res,method,args);
}
//根据设备ID获取解决方案信息
function Getsolutionlist(res,method,args){
    if(args.machineId=='NaN'){
        return;
    }else {
        post_argu.post_argu(res,method,args);
    }

}
//显示方案
function GetAllShift(res,method,args){
    post_argu.post_argu(res,method);
}
//新增设备解决方案
function AddMachineShift(res,method,args){
    var data={
        machineId:args['machineId[]'],
        machineshiftlist:[
            {
                CYCLE_TYPE:args['machineshiftlist[0][CYCLE_TYPE]'],
                DAY_WEEK:args['machineshiftlist[0][DAY_WEEK]'],
                DISABLE_DATE:args['machineshiftlist[0][DISABLE_DATE]'],
                ENABLE_DATE:args['machineshiftlist[0][ENABLE_DATE]'],
                SOLUTION_NBR:args['machineshiftlist[0][SOLUTION_NBR]']
            }
        ]
    }
    post_argu.post_argu(res,method,data);
}
//删除某台设备关联的方案
function DelMachineShift(res,method,args){

    post_argu.post_argu(res,method,args);
}
//跟新方案
function UpdateShift(res,method,args){
    var arr=[];
    var key;
    for(var key in args){
        key=key;
    }
    var number=parseInt(key.match(/\d+/g)[0])+1;
    for(var i=0;i<number;i++){
        var obj={}
        obj.END_DATE=args['li['+i+'][END_DATE]'];
        obj.RANK_NUM=args['li['+i+'][RANK_NUM]'];
        obj.SHIFT_NAME=args['li['+i+'][SHIFT_NAME]'];
        obj.START_DATE=args['li['+i+'][START_DATE]'];
        obj.VALID_TIME=args['li['+i+'][VALID_TIME]'];
        arr[i]=obj
    }
    var data={
        solution:{
            SoluationID:args.SoluationID,
            SolutionName:args.SolutionName,
            li:arr
        }
    }
    post_argu.post_argu(res,method,data);
}
//新增方案
function AddShift(res,method,args){

    var data={
        solution:{
            SoluationID:args['solution[SoluationID]'],
            SolutionName:args['solution[SolutionName]'],
            li:[
                {
                    END_DATE:args['solution[li][0][END_DATE]'],
                    RANK_NUM:args['solution[li][0][RANK_NUM]'],
                    SHIFT_NAME:args['solution[li][0][SHIFT_NAME]'],
                    START_DATE:args['solution[li][0][START_DATE]'],
                    VALID_TIME:args['solution[li][0][VALID_TIME]']
                }
            ]
        }
    }
    post_argu.post_argu(res,method,data);
}
//删除方案
function DeleteShift(res,method,args){
    console.log(args)
    var a=[]
    a.push(args['SolutiondArrayId[]']);
    var data={
        SolutiondArrayId: a
    }
    post_argu.post_argu(res,method,data);
}
//
function UpdMachineShift(res,method,args){
    console.log(args)
    var data={
        machineId:args['machineId[]'],
        machineshiftlist:[
            {
                CYCLE_TYPE:args['machineshiftlist[0][CYCLE_TYPE]'],
                DAY_WEEK:args['machineshiftlist[0][DAY_WEEK]'],
                DISABLE_DATE:args['machineshiftlist[0][DISABLE_DATE]'],
                ENABLE_DATE:args['machineshiftlist[0][ENABLE_DATE]'],
                INPUT_GUID:args['machineshiftlist[0][INPUT_GUID]'],
                MAC_NBR:args['machineshiftlist[0][SOLUTION_NBR]']

            }
        ]
    }
    post_argu.post_argu(res,method,data);
}