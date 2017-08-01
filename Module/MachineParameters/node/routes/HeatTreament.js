var HeatTreamentctrl = require('../controller/HeatTreament.js');

module.exports = function(app) {
    //加载设备管理页面
    app.get('/HeatTreament', HeatTreamentctrl.index);
    app.get('/HeatTreamentPrint', HeatTreamentctrl.dayin);

    app.post('/HeatTreatment/:method', HeatTreamentctrl.fun);

}