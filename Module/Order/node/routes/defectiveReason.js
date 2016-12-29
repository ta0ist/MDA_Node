/**
 * Created by qb on 2016/12/21.
 */
var DefectiveReason=require('../controller/DefectiveReason.js');
module.exports=function(app){
    app.get('/DefectiveReason',DefectiveReason.DefectiveReason);
    app.post('/DefectiveReason/:method',DefectiveReason.fun);
    app.get('/DefectiveReason/:method',DefectiveReason.fun);
}