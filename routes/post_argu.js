var request = require('request');
var config = require(__dirname + '/config.js');
var errorcode = require(__dirname + '/error.js');
var path = require('path');
var session = require('express-session');


//提交参数
exports.post_argu = function(res, method, args) {
    request.post({
        url: method,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: args,
    }, function(error, response, body) {
        if (error) {
            throw error;
        } else {
            if (body.d) {
                var result = JSON.parse(body.d);
                res.json({
                    Data: result.Data,
                    Status: result.StatusCode,
                    Message: errorcode["Return_Code" + result.StatusCode]
                })
            } else {
                res.json({
                    Data: null,
                    Status: -9999,
                    Message: body.Message
                })
            }

        }
    })
}



//获取路径
exports.getpath = function(_path, method) {
    var pt = _path.split('\\');
    return global.Webservice + '/' + pt[pt.length - 4] + '/' + pt[pt.length - 1].split('.')[0] + '.asmx/' + method;
}

//获取语言
exports.getLanguage = function() {
    if (!session.language)
        session.language = 'cn.js';
    return require('../public/language/' + session.language);
}