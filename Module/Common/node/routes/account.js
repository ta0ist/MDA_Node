
var accountctrl = require('../controller/Account.js');

module.exports = function (app) {
    
    //账户页面
    app.get('/account', accountctrl.accountpage);

    //获取用户
    app.post('/getuser', accountctrl.getuser);

    //各种事件
    app.post('/account/:method',accountctrl.fun);
  
}



