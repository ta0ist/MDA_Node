var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_common = require('../../../../routes/post_argu.js');
const fs = require('fs');
exports.machineload = function(req, res) {
    post_common.permission(req, res, '/machine', 'view', path.resolve(__dirname, '../../web/view/machine/index'));
    // if (!req.session.menu) {
    //     res.redirect("/login");

    // } else {
    //     res.render(path.resolve(__dirname, '../../web/view/machine/index'), {
    //         menulist: req.session.menu,
    //         user: req.session.user,
    //         lang: post_common.getLanguage()
    //     });
    // }
}

// exports.GetGrouplist = function (req, res) {

//     request.post({ url: config.machineservice + '/GetGrouplist', form:{groupID: req.body.groupID}}, function (error, response, body) {
//         //   req.session.user = JSON.parse(body);
//         res.json(body)
//     });
// }

// exports.GetMachineList=function (req,res) {
//     request.post({ url: config.machineservice + '/GetMachineList', form: { groupId: req.body.keyword,pageIndex: req.body.PageIndex,pageSize:req.body.PageSize } }, function (error, response, body) {
//         if (body == null) { }
//         else {
//             res.json({
//                 Data: JSON.parse(body),
//                 Status: 0,
//                 Message:"成功"
//             })
//         }
//     });

// }


exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    args.push(method = post_common.getpath(__filename, req.params.method));

    args.push(req.body);

    doCallback(eval(req.params.method), args, res);

}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}
//获取所有的设备组list
function GetGrouplist(res, method, args) {
    post_common.post_argu(res, method, args);
}
//获取所有的设备组list
function GetGrouplist_Customer(res, method, args) {
    var data = { groupID: 0 };
    post_common.post_argu(res, method, data);
}

//按关键字查询设备组list
function GetKeywordGrouplist(res, method, args) {
    post_common.post_argu(res, method, args);
}
//按组ID获取设备list
function GetMachineList(res, method, args) {

    post_common.post_argu(res, method, args);
}
//新增设备组
function AddMachineGroup(res, method, args) {

    var macgroup = {
        macgroup: args
    };

    post_common.post_argu(res, method, macgroup);

}
//按关键字获取设备list
function GetKeywordMachinelist(res, method, args) {

    post_common.post_argu(res, method, args);
}


//修改设备组
function UpdMachineGroup(res, method, args) {
    var macgroup = { macgroup: args };
    post_common.post_argu(res, method, macgroup);

}
//删除设备组
function DelMachineGroup(res, method, args) {

    post_common.post_argu(res, method, args);

}
//新增设备信息
function AddMachine(res, method, args) {

    var machineInfo = { machineInfo: args };
    post_common.post_argu(res, method, machineInfo);

}
//修改设备信息
function UpdMachine(res, method, args) {
    var machineInfo = { machineInfo: args };
    post_common.post_argu(res, method, machineInfo);
}
//删除设备信息
function DelMachine(res, method, args) {
    var strs = args.macs.split(',');
    var mac = { machineIds: strs };
    post_common.post_argu(res, method, mac);


}
//将所选设备移到新组下面
function MoveMachine(res, method, args) {
    var maclist = args.machineiIds.split(',');
    var para = { newGroupId: args.groupId, machineIds: maclist };
    post_common.post_argu(res, method, para);


}

//获取所有的设备组和设备
function GetAllMachineAndMachineGroup(res, method, args) {
    post_common.post_argu(res, method, args);
}

//获取所有的设备组和设备
function GetAllMachineAndMachineGroup_CustomerParameter(res, method, args) {
    var groupID = { groupID: 0 }
    post_common.post_argu(res, method, groupID);
}

function ShowAllPic(res, method, args) {
    var root = './public';
    var imagesDir = '/images/machine';
    var body = {},
        data = [];
    fs.readdirSync(root + imagesDir).forEach(function(file) {
        if (fs.lstatSync(root + imagesDir + '/' + file)) {
            var dirname = file;
            // var img = {};
            // img.FileDesc = "file";
            fs.readdirSync(root + imagesDir + '/' + file).forEach(function(file) {
                data.push({ FileName: file, FilePath: imagesDir + '/' + dirname + '/' + file, FileDesc: dirname });
            })
            body.Data = data;
        }
    })
    body.Status = 0;
    body.Message = "上传成功！";
    res.json(body);

}


function DeleteFile(res, method, args) {
    let filename = args.fileName;
    let imagesDir = './public/images/machine/NoDefault/';
    fs.unlink(path.resolve(imagesDir + filename), (err) => {
        var body = {};
        if (err) {
            body.Status = -9999;
            body.Message = err;
            res.json(body);
        }
        body.Status = 0;
        body.Message = "删除成功！";
        res.json(body);
    })
}