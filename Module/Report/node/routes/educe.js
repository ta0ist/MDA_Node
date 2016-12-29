
var educectrl = require('../controller/Report.js');

module.exports = function (app) {
    //主页面
    app.get('/reports', educectrl.page);
    
    //处理各种事件
    app.get('/reports/:method',educectrl.fun);
    app.post('/reports/:method',educectrl.fun);

    //导出报表
    app.get('/reports/r/GetRepost',educectrl.GetRepost);
}