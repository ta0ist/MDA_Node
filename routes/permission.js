var db = require('/db.js');
var util = require('util');
var session = require('express-session');
exports.Check_Permission = function(permission_id) {
    var user_id = session.user_id;
    var sql = util.format('select * from permission where user_id=%s', user_id);
    db.sql(sql, function(error, result) {

    })

}