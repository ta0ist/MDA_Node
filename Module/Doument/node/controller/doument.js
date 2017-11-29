var path = require('path');
var config = require('../../../../routes/config');
var post_argu = require('../../../../routes/post_argu.js');
var session = require('express-session');
var db = require('../../../../routes/db.js');
var fs = require('fs');
exports.documentManageindex = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/DocumentManage/index'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage()
        });
    }
}

exports.knowledgeindex = function(req, res) {
    if (!req.session.user)
        res.redirect('/');
    else {
        res.render(path.resolve(__dirname, '../../web/view/Knowledge/index'), {
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

function GetAllFiles(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/GetAllFiles';
    post_argu.post_argu(res, url, args);
}

function GetSubAllFiles(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/GetSubAllFiles';
    post_argu.post_argu(res, url, args);
}

function GetFileInfoByFileName(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/GetFileInfoByFileName';
    post_argu.post_argu(res, url, args);
}

function modifyFie(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/modifyFie';
    post_argu.post_argu(res, url, { docf: args });
}

function AddFile(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/AddFile';
    post_argu.post_argu(res, url, args);
}

function DelFile(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/DelFile';
    post_argu.post_argu(res, url, args);
}

function DelSubFile(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/DelSubFile';
    post_argu.post_argu(res, url, args);
}

function AddTag(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/AddTag';
    post_argu.post_argu(res, url, args);
}

function DeleteTag(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/DeleteTag';
    post_argu.post_argu(res, url, args);
}

function DeleteOnlyTag(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/DeleteOnlyTag';
    post_argu.post_argu(res, url, args);
}

function ModifyTag(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/ModifyTag';
    post_argu.post_argu(res, url, args);
}

function GetAllFileWithTagList(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/GetAllFileWithTagList';
    post_argu.post_argu(res, url, args);
}

function GetWebLookupTag(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/GetWebLookupTag';
    post_argu.post_argu(res, url, args);
}

function GetTopTag(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/GetTopTag';
    post_argu.post_argu(res, url, args);
}

function GetDocumentInfByTagID(res, method, args) {
    var url = "http://" + config.webIP + ':' + config.webPort + '/Modules/Document/DocumentManage.asmx/GetDocumentInfByTagID';
    post_argu.post_argu(res, url, args);
}

exports.DocumentmodifyFie = function(req, res) {

    var sql = `UPDATE dbo.DOCUMENT SET DIR_NAME='${req.body.DirectoryName}' WHERE DIR_NBR=${req.body.DirectoryId}`;
    db.sql(sql, function(err, result) {
        if (!err) {
            res.json({
                Message: '操作成功!',
                Status: 0
            })
        }
    })
}