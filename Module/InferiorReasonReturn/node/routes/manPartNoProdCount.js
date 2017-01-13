var manPartNoProdCount = require('../controller/ManPartNoProdCount.js');

module.exports = function(app) {
    //加载设备管理页面
    app.get('/manPartNoProdCount', manPartNoProdCount.manPartNoProdCount);
    app.get('/manPartNoProdCount/:method', manPartNoProdCount.fun);
    app.post('/manPartNoProdCount/:method', manPartNoProdCount.fun);

}