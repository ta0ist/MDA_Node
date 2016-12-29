var activation = require('../controller/MachineActivations.js');

module.exports = function (app) {
    //加载设备管理页面
    app.get('/machineactivation', activation.activationpage);
    app.post('/machineactivation/:method', activation.fun);

    app.get('/MachineOutPutIndex', activation.OutPutIndex);

    app.post('/machineactivation/r/GetMachineActivation', activation.MachineActivationDetail);

    app.post('/machineactivation/r/GetGroupActivation', activation.GroupActivationDetail);
}