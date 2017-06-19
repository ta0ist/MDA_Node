var path = require('path');
var request = require('request');
var config = require('../../../../routes/config.js')
var post_argu = require('../../../../routes/post_argu.js');

exports.index = function(req, res) {
    post_argu.permission(req, res, '/HeatTreament', 'view', path.resolve(__dirname, '../../web/view/HeatTreament/index'));
}
exports.dayin = function(req, res) {
    res.render(path.resolve(__dirname, '../../web/view/HeatTreamentPrint/index'));
}