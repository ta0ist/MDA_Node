var Alarm = require('../controller/Alarm.js');

module.exports = function(app) {

    //加载页面
    app.get('/ZFJD/alarm', Alarm.index);
    //各种事件
    app.post('/ZFJD/alarm/getAlarm', Alarm.getAlarm);

    app.post('/ZFJD/alarm/:method', Alarm.fun);

    app.get('/ZFJD/alarm/:method', Alarm.fun);


}