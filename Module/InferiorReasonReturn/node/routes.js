var InferiorReasonReturn = {};
InferiorReasonReturn.InferiorMultiple = require('./routes/inferiorMultiple.js');
var method_path = '/Modules/InferiorReasonReturn/Interferior';
module.exports = function(app) {
    InferiorReasonReturn.InferiorMultiple(app);
}