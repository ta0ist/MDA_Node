/**
 * Created by qb on 2016/12/21.
 */
var PlanSurvey=require('../controller/PlanSurvey.js');
module.exports=function(app){
    app.get('/PlanSurvey',PlanSurvey.PlanSurvey);
    app.post('/PlanSurvey/:method',PlanSurvey.fun);
    app.get('/PlanSurvey/:method',PlanSurvey.fun);



}