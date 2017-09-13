var ProcessParameters = {};
ProcessParameters.processParameters = require('./routes/processParameters.js');



module.exports = function(app) {
    ProcessParameters.processParameters(app);

}