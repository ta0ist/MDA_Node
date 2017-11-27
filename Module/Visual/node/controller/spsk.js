var path = require('path');
let fs = require('fs');
var request = require('request');
var config = require('../../../../routes/config.js');
var post_argu = require('../../../../routes/post_argu.js');
var db = require('../../../../routes/db.js');
var _ = require('underscore');
var moment = require('moment');

exports.index = (req, res) => {
    res.render(path.resolve(__dirname, '../../web/view/spsk/index'))
}

exports.GetStatusColorAndCount = (req, res) => {
    let method = global.Webservice + '/Common/Main.asmx/GetStatusColorAndCount';
    post_argu.post_argu(res, method);
}