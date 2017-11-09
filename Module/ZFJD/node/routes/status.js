var Status = require('../controller/Status.js');

module.exports = function(app) {

    //加载页面
    app.get('/ZFJD/status', Status.index);
    //各种事件
    app.post('/ZFJD/status/:method', Status.fun);

    app.get('/ZFJD/status/:method', Status.fun);

    app.get('/ZFJD/getMac', Status.getMac);
}