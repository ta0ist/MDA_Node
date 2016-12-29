/**
 * Created by qb on 2016/11/30.
 */
var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
exports.MachineWorkingState = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/MachineWorkingState/index'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage()
        });
    }
    //res.render(path.resolve(__dirname,'../../web/view/MachineWorkingState/index'),{ menulist: req.session.menu });
}
exports.OutPutIndex = function(req, res) {

    res.render(path.resolve(__dirname, '../../web/view/MachineWorkingState/OutPutIndex'));
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    //var method = config.webMachineWorkingStateService + '/'+ req.params.method;
    var method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);
    doCallback(eval(req.params.method), args, res);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}
//获取人员和人员组
function GetAllMemberAndMemberGroup(res, method, args) {
    post_argu.post_argu(res, method, { groupID: 0 });
}
//根据关键字获取人员信息
function GetKeywordMemberlist(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//GetEmployeeStatuRate
function GetEmployeeStatuRate(res, method, args) {
    //var arr_mem_nbrs=[];
    //if(args.arr_mem_nbrs==undefined){
    //    if((typeof args['mac_nbrs[]'])=='string'){
    //        arr_mem_nbrs.push(args['mac_nbrs[]']);
    //    }else {
    //        arr_mem_nbrs=args['mac_nbrs[]'];
    //    }
    //
    //}else {
    //    re.push(args.MAC_NBR_LIST);
    //}
    var arr_mem_nbrs = convenient_tool(args['mem_nbrs[]']);
    var arr_mac_nbrs = convenient_tool(args['mac_nbrs[]']);
    var data = {
        endtime: args.endtime,
        mem_nbrs: arr_mem_nbrs,
        mac_nbrs: arr_mac_nbrs,
        posttype: args.posttype,
        starttime: args.starttime
    }
    post_argu.post_argu(res, method, data);
}


function convenient_tool(arr) {
    var re = [];
    if ((typeof arr) == 'string') {
        re.push(arr);
    } else {
        re = arr;
    }
    return re;
}