var inferiorMultiple = require('../controller/InferiorMultiple.js');

module.exports = function(app) {
    //加载设备管理页面
    app.get('/inferiorMultiple', inferiorMultiple.inferiorMultiple);
    app.get('/inferiorMultiple/:method', inferiorMultiple.fun);
    app.post('/inferiorMultiple/:method', inferiorMultiple.fun);

}