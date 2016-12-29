var fclendarctrl = require('../controller/FactoryCalendar.js');

module.exports = function (app) {
    
    //账户页面
    app.get('/fcalendar', fclendarctrl.fclendarpage);

      //各种事件
    app.post('/fcalendar/:method',fclendarctrl.fun);
  
}
