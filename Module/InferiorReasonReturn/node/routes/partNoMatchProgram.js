var partNoMatchProgram = require('../controller/PartNoMatchProgram.js');

module.exports = function(app) {
    //加载设备管理页面
    app.get('/partNoMatchProgram', partNoMatchProgram.partNoMatchProgram);
    app.get('/partNoMatchProgram/:method', partNoMatchProgram.fun);
    app.post('/partNoMatchProgram/:method', partNoMatchProgram.fun);

}