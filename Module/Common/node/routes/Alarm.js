/**
 * Created by qb on 2016/11/23.
 */
var Alarmctrl=require('../controller/Alarm');
module.exports=function(app){
    app.get('/Alarm',Alarmctrl.Alarm);
    app.post('/Alarm/:method',Alarmctrl.fun);
    app.get('/Alarm/:method',Alarmctrl.fun);
}