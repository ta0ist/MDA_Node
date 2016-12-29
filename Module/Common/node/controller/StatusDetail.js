/**
 * Created by qb on 2016/11/16.
 */
var path = require('path');
var post_argu = require('../../../../routes/post_argu.js');
var config = require('../../../../routes/config.js');
var request = require('request');
exports.StatusDetail = function(req, res) {
        if (!req.session.user)
            res.redirect('/');
        else
            res.render(path.resolve(__dirname, '../../web/view/StatusDetail/index'), {
                menulist: req.session.menu,
                user: req.session.user,
                lang: post_argu.getLanguage()
            });
    }
    //exports.GetAllMachineAndMachineGroup = function (req, res) {
    //    request.post({
    //        url:config.webStatusDetailService + '/GetAllMachineAndMachineGroup',
    //        json:true,
    //        headers: {
    //            "content-type": "application/json"
    //        },
    //        body:{groupID: 0}
    //    },function(error, response,body){
    //        console.log(body);
    //        res.json({
    //            Data:JSON.parse(body.d),
    //            Status:0,
    //            Message:"成功"
    //        })
    //    })
    //}
    //exports.GetMachineStatusListByName = function (req, res) {
    //    var data=req.body.data;
    //    request.post({
    //        url:config.webStatusDetailService + '/GetMachineStatusListByName',
    //        json:true,
    //        headers: {
    //            "content-type": "application/json"
    //        },
    //        body:data
    //    },function(error, response,body){
    //        console.log(body);
    //        res.json({
    //            Data:JSON.parse(body.d),
    //            Status:0,
    //            Message:"成功"
    //        })
    //    })
    //}

exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);
    // for(var i in req.body)
    // {
    //     var temp = {};
    //     temp[i] = req.body[i];
    //     args.push(temp);
    // }
    doCallback(eval(req.params.method), args, res);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

function GetAllMachineAndMachineGroup(res, method, args) {
    var groupID = { groupID: 0 }
    post_argu.post_argu(res, method, groupID);
}

function GetKeywordMachinelist(res, method, args) {
    post_argu.post_argu(res, method, args);
}

function GetMachineStatusListByName(res, method, args) {
    var ObjectIDs = [];
    ObjectIDs.push(args.ObjectIDs);
    var data = {
        StartTime: args.StartTime,
        EndTime: args.EndTime,
        ShowDetails: args.ShowDetails,
        ObjectIDs: ObjectIDs
    }
    post_argu.post_argu(res, method, data);
}