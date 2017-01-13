var db = require('../../../../routes/db.js');
var path = require('path');
exports.Index = function(req, res) {
    res.render(path.resolve(__dirname, '../../web/view/cut/index'));
}