var InferiorReasonReturn = {};
InferiorReasonReturn.InferiorMultiple = require('./routes/inferiorMultiple.js');
InferiorReasonReturn.ManPartNoProdCount = require('./routes/manPartNoProdCount.js');
InferiorReasonReturn.PartNoInferior = require('./routes/partNoInferior.js');
module.exports = function(app) {
    InferiorReasonReturn.InferiorMultiple(app);
    InferiorReasonReturn.ManPartNoProdCount(app);
    InferiorReasonReturn.PartNoInferior(app);
}