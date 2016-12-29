/**
 * Created by qb on 2016/12/21.
 */
var ProductionPlan=require('../controller/ProductionPlan.js');
module.exports=function(app){
    app.get('/ProductionPlan',ProductionPlan.ProductionPlan);
    app.post('/ProductionPlan/:method',ProductionPlan.fun);
    app.get('/ProductionPlan/:method',ProductionPlan.fun);
}