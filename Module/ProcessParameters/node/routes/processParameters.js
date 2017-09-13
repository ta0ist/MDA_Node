var ProcessParameters = require('../controller/ProcessParameters.js');
module.exports = function(app) {
    app.get('/ProcessParameter', ProcessParameters.ProcessParameters);
    app.post('/ProcessParameters/:method', ProcessParameters.fun);
    app.get('/ProcessParameters/:method', ProcessParameters.fun);
}