//路由集合


var logger = require('./logger.js');
var fs = require("fs");
var path = require('path');



module.exports = function (app) {
    var module_path = path.resolve(__dirname + '/../Module');
    var routes = {};
    fs.readdirSync(module_path).forEach(function (file) {
        routes[file] = require('../Module/' + file + '/node/routes.js');
        routes[file](app);
        logger.info('路由' + file + '加载成功！');
    })
}