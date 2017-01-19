var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
var db = require('../../../../routes/db.js');
exports.toolConfig = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/toolConfig/index'), {
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

exports.getTool = function(req, res) {
    db.sql('SELECT ID,Product_Model,Part_Name,Line,MP.GP_NAME,Program,Process FROM dbo.TOOLS_PRODUCT P LEFT JOIN dbo.MACHINE_GROUP_INFO MP ON MP.GP_NBR=P.Line', function(err, data) {
        res.json({
            Data: data,
            Status: 0,
            Message: '操作成功'
        })
    })
}
exports.add = function(req, res) {
    var obj = req.body;
    var strsql = 'INSERT INTO dbo.TOOLS_PRODUCT(Product_Model,Part_Name,Line,Program,Process)';
    strsql += "VALUES('" + obj.Product_Model + "','" + obj.Part_Name + "','" + obj.Line + "','" + obj.Program + "','" + obj.Process + "')";
    console.log(req)
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
exports.edit = function(req, res) {
    var obj = req.body;
    var strsql = "UPDATE dbo.TOOLS_PRODUCT SET "
    strsql += "Product_Model='" + obj.Product_Model + "'," +
        "Part_Name='" + obj.Part_Name + "'," +
        "Line='" + obj.Line + "'," +
        "Program='" + obj.Program + "'," +
        "Process='" + obj.Process + "'" +
        "WHERE ID=" + obj.ID + ""
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

exports.delete = function(req, res) {
    var obj = req.body;
    var strsql = "DELETE FROM dbo.TOOLS_PRODUCT WHERE ID=" + obj.ID
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

exports.deleteAll = function(req, res) {
    var arr = req.body['Ids[]'];
    var d = arr.join("','")
        //delete from t where id in('1,2,3,4,5,6,7,8')
    var strsql = "DELETE FROM dbo.TOOLS_PRODUCT WHERE ID in('" + d + "')";
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

exports.search = function(req, res) {
    var str = req.body.filter
    var strsql = "SELECT ID,Product_Model,Part_Name,Line,MP.GP_NAME,Program,Process FROM dbo.TOOLS_PRODUCT P LEFT JOIN dbo.MACHINE_GROUP_INFO MP ON MP.GP_NBR=P.Line" +
        " where Part_Name like '%" + str + "%'"
    db.sql(strsql, function(err, data) {
        res.json({
            Data: data,
            Status: 0,
            Message: '操作成功'
        })
    })
}