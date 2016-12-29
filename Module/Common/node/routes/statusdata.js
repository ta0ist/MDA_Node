var statusdatactrl = require('../controller/StatusData.js');

module.exports = function(app){
    //渲染页面
    app.get('/statusdata',statusdatactrl.statusdatapage);

    //处理方法
    app.post('/statusdata/:method',statusdatactrl.fun);

}
