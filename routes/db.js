const mssql = require('mssql');
var db = {};
const config = {
    user: 'sa',
    password: '1`q',
    server: '192.168.0.96',
    database: 'BANDEX2017',
    port: 1433,
    option: {
        encrpt: true
    },
    pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 30000
    }
};

// db.sql = function(sql, callBack) {
//     var con = mssql.connect(config).then(() => {
//         return mssql.query(sql)
//     }).then(result => {
//         callBack(result)
//     }).catch(err => {
//         callBack(err)
//     })
// }


db.sql = function(sql, callBack) {
    var connection = new mssql.Connection(config, function(err) {
        if (err) {
            console.log(err);
            return;
        }
        var ps = new mssql.PreparedStatement(connection);
        ps.prepare(sql, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            ps.execute('', function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                ps.unprepare(function(err) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                        return;
                    }
                    callBack(err, result);
                })
            })
        })
    })
}



module.exports = db;