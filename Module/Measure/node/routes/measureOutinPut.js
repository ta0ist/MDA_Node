var measureOutinPut = require('../controller/MeasureOutinPut.js');
module.exports = function(app) {
    app.get('/measureOutinPut', measureOutinPut.measureOutinPut);
    app.post('/measureOutinPut/:method', measureOutinPut.fun);
    app.get('/measureOutinPut/:method', measureOutinPut.fun);
}