/**
 * Created by qb on 2016/11/16.
 */
var path = require('path');
var config = require('../../../../routes/config.js');
var request = require('request');
var logger = require('../../../../routes/logger.js');
var post_argu = require('../../../../routes/post_argu.js');
var db = require('../../../../routes/db.js')

exports.factory = function(req, res) {
        if (!req.session.user)
            res.redirect('/');
        else {
            res.render(path.resolve(__dirname, '../../web/view/factory/index'), {
                menulist: req.session.menu,
                user: req.session.user,
                lang: post_argu.getLanguage()
            });
        }
        //res.render(path.resolve(__dirname,'../../web/view/factory/index'),{menulist: req.session.menu,user:req.session.user});
        // res .redirect('/');
        // }
    }
    /// 获取车间
exports.GetWorkPlaceNbrs = function(req, res) {
        res.json({
                Data: config.factory,
                Status: 0
            })
            // request.post({
            //     url: post_argu.getpath(__filename, 'GetWorkPlaceNbrs'),
            //     json: true,
            //     headers: {
            //         "content-type": "application/json"
            //     },
            //     body: { workplace: "" }
            // }, function(error, response, body) {
            //     res.json({
            //         Data: JSON.parse(body.d),
            //         Status: 0,
            //         Message: "成功"
            //     })
            // })

    }
    /// 拖拽div
exports.UpdateOrderedDiv = function(req, res) {
        var newids = req.body.newids;
        var oldids = req.body.oldids;
        console.log(newids);
        console.log(oldids);
        request.post({
            url: post_argu.getpath(__filename, 'UpdateOrderedDiv'),
            json: true,
            headers: {
                "content-type": "application/json"
            },
            body: { newids: newids, oldids: oldids }
        }, function(error, response, body) {
            res.json({
                Data: JSON.parse(body.d),
                Status: 0,
                Message: "成功"
            })
        })
    }
    //右边状态
exports.GetImmediateState = function(req, res, next) {
    var currentTool = req.body.Page;

    request.post({
        url: post_argu.getpath(__filename, 'GetImmediateState'),
        json: true,
        headers: {
            "content-type": "application/json"
        },
        body: { Page: currentTool }
    }, function(error, response, body) {
        if (!body.d) {
            res.json({
                Status: -9999,
                Message: "成功"
            });
            next();
        } else {
            res.json({
                Data: JSON.parse(body.d),
                Status: 0,
                Message: "成功"
            });
        }
    })
}