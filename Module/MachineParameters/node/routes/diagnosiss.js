var diagnosisctrl = require('../controller/Diagnosis.js');

module.exports = function (app) {
    //加载设备管理页面
     app.get('/diagnosis', diagnosisctrl.diagnosispage);
      app.get('/diagnosisdetail', diagnosisctrl.diagnosisdetailpage);
     //app.post('/GetImmediatelyparameter', diagnosisctrl.GetImmediatelyparameter);
     app.post('/diagnosis/:method', diagnosisctrl.fun);

}