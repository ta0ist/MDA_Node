var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
var db = require('../../../../routes/db.js');
exports.configDetails = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/toolConfig/configDetails'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage()
        });
    }
}
exports.fun = function(req, res) {
    var args = [];
    args.push(res);
    //var method = config.webMachineWorkingStateService + '/'+ req.params.method;
    var method = post_argu.getpath(__filename, req.params.method);
    args.push(method);
    args.push(req.body);
    args.push(req);
    doCallback(eval(req.params.method), args, res, req);
}

function doCallback(fn, args, res) {
    fn.apply(this, args);
}

function getPlanSchedule(res, method, args) {

    post_argu.post_argu(res, method, { PageModel: args });
}
exports.getData = function(req, res) {
    var obj = req.body;
    var strsql = "SELECT TOL_P.ID,TOL_P.Line,TOL_P.Part_Name,TOL_P.Process,TOL_P.Product_Model,TOL_P.Program," +
        "TI.CPK,TI.Cutting_Content,TI.Dime_Nsion,TI.Down_Offset,TI.Macro_Address,TI.QPLC,TI.Remark," +
        "TI.Tool,TI.Tool_No,TI.Turret,TI.Up_Offset " +
        " FROM dbo.TOOLS_PRODUCT TOL_P " +
        "LEFT JOIN dbo.TOOLS_INFO TI" +
        " ON TOL_P.ID=TI.X_nbr  where TOL_P.ID=" + obj.id

    db.sql(strsql, function(err, data) {
        res.json({
            Data: data,
            Status: 0,
            Message: '操作成功'
        })
    })

}

exports.addData = function(req, res) {
    var obj = req.body
    var B = obj.Turret == "L" ? 0 : 1;
    var strsql = "INSERT INTO dbo.TOOLS_INFO" +
        "(X_nbr,Tool,Tool_No,Cutting_Content,Turret,Dime_Nsion,Up_Offset,Down_Offset,CPK,Macro_Address,Remark,QPLC,OFFSET_AXIS,OFFSET_TYPE)" +
        " VALUES(" +
        obj.X_nbr + "," +
        "'" + obj.Tool + "'," +
        "'" + obj.Tool_No + "'," +
        "'" + obj.Cutting_Content + "'," +
        B + "," +
        obj.Dime_Nsion + "," +
        obj.Up_Offset + "," +
        obj.Down_Offset + "," +
        obj.CPK + "," +
        "'" + obj.Macro_Address + "'," +
        "'" + obj.Remark + "'," +
        "'" + obj.QPLC + "'," +
        "'" + obj.OFFSET_AXIS + "'," +
        "'" + obj.OFFSET_TYPE + "'" +
        ")"
    db.sql(strsql, function(err, data) {
        if (data == undefined) {
            res.json({
                Data: "",
                Status: 0,
                Message: '操作成功'
            })
        } else {
            res.json({
                Status: 1,
                Message: err
            })
        }
    })

}

exports.getToolsData = function(req, res) {
    var obj = req.body
    var sqlstr = "SELECT X_nbr,Tool,Tool_No,Cutting_Content,Turret,Dime_Nsion," +
        "Up_Offset,Down_Offset,CPK,Macro_Address,Remark,QPLC,OFFSET_AXIS,OFFSET_TYPE " +
        " FROM dbo.TOOLS_INFO WHERE X_nbr=" + obj.id
    db.sql(sqlstr, function(err, data) {
        res.json({
            Data: data,
            Status: 0,
            Message: '操作成功'
        })
    })
}
exports.edit = function(req, res) {
    var obj = req.body
    var B = obj.Turret == "L" ? 0 : 1;
    var sqlstr = "UPDATE dbo.TOOLS_INFO SET" +
        " Tool='" + obj.Tool + "'," +
        "Tool_No='" + obj.Tool_No + "'," +
        "Cutting_Content='" + obj.Cutting_Content + "'," +
        "Turret=" + B + "," +
        " Dime_Nsion=" + obj.Dime_Nsion + "," +
        " Up_Offset=" + obj.Up_Offset + "," +
        " Down_Offset=" + obj.Down_Offset + "," +
        " CPK=" + obj.CPK + "," +
        " Macro_Address='" + obj.Macro_Address + "'," +
        " Remark='" + obj.Remark + "'," +
        " X_nbr=" + obj.X_nbr + "," +
        " OFFSET_AXIS='" + obj.OFFSET_AXIS + "'," +
        " OFFSET_TYPE='" + obj.OFFSET_TYPE + "'" +
        " WHERE  QPLC='" + obj.QPLC + "'"
    db.sql(sqlstr, function(err, data) {
        if (data == undefined) {
            res.json({
                Data: "",
                Status: 0,
                Message: '操作成功'
            })
        } else {
            res.json({
                Status: 1,
                Message: err
            })
        }
    })
}

exports.delete = function(req, res) {
    var obj = req.body;
    var sqlstr = "DELETE FROM dbo.TOOLS_INFO WHERE   QPLC='" + obj.QPLC + "'"
    db.sql(sqlstr, function(err, data) {
        if (data == undefined) {
            res.json({
                Data: "",
                Status: 0,
                Message: '操作成功'
            })
        } else {
            res.json({
                Status: 1,
                Message: err
            })
        }
    })
}