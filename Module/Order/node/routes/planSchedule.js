/**
 * Created by qb on 2016/12/20.
 */
var OrderLogin=require('../controller/PlanSchedule.js');
module.exports=function(app){
    app.get('/PlanSchedule',OrderLogin.PlanSchedule);
    app.post('/PlanSchedule/:method',OrderLogin.fun);
    app.get('/PlanSchedule/:method',OrderLogin.fun);



}