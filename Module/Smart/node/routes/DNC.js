let DNCCtrl = require('../controller/DNCCtrl.js');

module.exports = function(app) {
    //主页面
    app.get('/DNC', DNCCtrl.index);

    app.post('/DNC/SendProgram', DNCCtrl.SendProgram);

    app.post('/DNC/ReceviceProgram', DNCCtrl.ReceviceProgram);
}