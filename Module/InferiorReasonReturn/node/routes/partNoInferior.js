var partNoInferior = require('../controller/PartNoInferior.js');

module.exports = function(app) {
    //加载设备管理页面
    app.get('/partNoInferior', partNoInferior.partNoInferior);
    app.get('/partNoInferior/:method', partNoInferior.fun);
    app.post('/partNoInferior/:method', partNoInferior.fun);

}