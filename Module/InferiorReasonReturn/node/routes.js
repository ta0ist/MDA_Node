var InferiorReasonReturn = {};
InferiorReasonReturn.InferiorMultiple = require('./routes/inferiorMultiple.js');
InferiorReasonReturn.ManPartNoProdCount = require('./routes/manPartNoProdCount.js');
var method_path = '/Modules/InferiorReasonReturn/Interferior';
module.exports = function(app) {
    InferiorReasonReturn.InferiorMultiple(app);
    InferiorReasonReturn.ManPartNoProdCount(app);
}