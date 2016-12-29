
var path = require('path');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
var fs = require('fs');
//加载页面
exports.index = function (req, res) {
    if (!req.session.menu) {
        res.redirect("/login");

    } else {
        res.render(path.resolve(__dirname, '../../web/view/member/index'), { menulist: req.session.menu,user:req.session.user });
    }
}
//加载组
//exports.GetMenberGrouplist = function (req, res) {
//    request.post({
//        url: config.wbmember + '/GetGrouplist',
//        form: { groupId: 0 },
//        json:true,
//        headers: {
//            "content-type": "application/json",
//        }
//    }, function (error, response, body) {
//        console.log(body);
//        res.json({
//            Data: body,
//            Status: 0,
//            Message: "成功"
//        } )
//    });
//}

exports.fun = function (req, res) {
    var args = [];
    args.push(res);
    args.push(method =post_argu.getpath(__filename,req.params.method));
    args.push(req.body);
    doCallback(eval(req.params.method), args, res);

}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}
//加载用户组
function GetGrouplist(res, method, args) {
    post_argu.post_argu(res, method, args);
}
// 根据人员组ID获取人员信息 (分页)
function GetMemberlist(res, method, args) {
    var para = { pinfo: args, keyword: args.keyword }
    post_argu.post_argu(res, method, para);
}
//新增组
function AddGroup(res, method, args) {

    var membergroupinfo = {
        membergroupinfo: args
    };

    post_argu.post_argu(res, method, membergroupinfo);
}
//编辑组
function UpdGroup(res, method, args) {
    var membergroupinfo = {
        membergroupinfo: args
    };
    post_argu.post_argu(res, method, membergroupinfo);
}
//删除组
function DelGroup(res, method, args) {
    post_argu.post_argu(res, method, args);
}
//新增人员
function AddMember(res, method, args) {
    var para = { memberinfo: args };
    post_argu.post_argu(res, method, para);
}
//编辑人员
function DelMember(res, method, args) {

    var arg;
    for (var i in args) {
        arg = i;
    }
    post_argu.post_argu(res, method, JSON.parse(arg));
}
//移动租的时候下拉框的查询
function GetKeywordGrouplist(res, method, args) {
    var para = { pinfo: args, keyword: args.keyword }
    post_argu.post_argu(res, method, para);
}
//移动组
function MoveMemberGroup(res, method, args) {
    var para = { groupId: args.groupId, memberIds: args["memberIds[]"] }
    post_argu.post_argu(res, method, para);
}
//人员修改
function UpdMember(res, method, args) {
    var para = { memberinfo: args };
    post_argu.post_argu(res, method, para);
}
//关键字查询
function GetKeywordMemberlist(res, method, args) {
    var para = { pinfo: args, keyword: args.keyword }
    post_argu.post_argu(res, method, para);
}
//显示所有图片
function ShowAllPic(res, method, args) {
    post_argu.post_argu(res, method);
}
//上传
function UpLoadFileWithCut(res, method, args) {
    //post_argu.post_argu(res,method);
}

function ShowAllPic(res, method, args) {
    var root = './public';
    var imagesDir = '/images/people';
    var body = {}, data = [];
    fs.readdirSync(root + imagesDir).forEach(function (file) {
        if (fs.lstatSync(root + imagesDir + '/' + file)) {
            var dirname = file;
            // var img = {};
            // img.FileDesc = "file";
            fs.readdirSync(root + imagesDir + '/' + file).forEach(function (file) {
                data.push({ FileName: file, FilePath: imagesDir + '/' + dirname + '/' + file, FileDesc: dirname });
            })
            body.Data = data;
        }
    })
    body.Status = 0;
    body.Message = "上传成功！";
    res.json(body);

}








