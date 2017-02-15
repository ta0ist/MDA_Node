var db = require('../../../../routes/db.js');
var path = require('path');
var config = require('../../../../routes/config.js');
exports.Index = function(req, res) {
    res.render(path.resolve(__dirname, '../../web/view/cut/index'));
}


exports.product = function(req, res) {
    db.sql("select * from dbo.TOOLS_PRODUCT tr left join TOOLS_INFO ti on tr.ID = ti.X_nbr where Product_Model='" + config.model + "'", function(err, result) {
        if (err) {
            res.json({
                Status: -9999,
                Message: err
            })
        } else {
            res.json({
                Data: result,
                Status: 0,
                Message: '操作成功！'
            })
        }
    })
}

exports.get_TOOLS_MEASURED = function(req, res) {
    var MAC_NBR = req.body.MAC_NBR;
    // var MAC_NBR = 22;
    var PART_NO = req.body.PART_NO;
    var ADDR = req.body.ADDR;
    db.sql("exec Pro_getOFT " + MAC_NBR + ", '" + PART_NO + "', '" + ADDR + "'",
        function(err, result) {
            if (err) {
                res.json({
                    Status: -9999,
                    Message: err
                })
            } else {
                res.json({
                    Data: result,
                    Status: 0,
                    Message: '操作成功！'
                })
            }
        }
    )
}