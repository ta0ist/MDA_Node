var db = require('/db.js');
var util = require('util');
var session = require('express-session');
exports.Check_Menu_Permission = function(permission_id, res) {
    var user_id = session.user_id;
    var sql_command = util.format('select * from permission where user_id=%s', user_id);
    db.sql(sql_command, function(err, result) {
        if (err) {
            console.log(err);
            res.send({
                Status: -9999,
                Message: err
            })
        }
        if (result.length == 0) {
            res.redirect('/');
        }
    })
}