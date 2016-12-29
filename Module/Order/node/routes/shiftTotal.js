/**
 * Created by qb on 2016/12/21.
 */
var ShiftTotal=require('../controller/ShiftTotal.js');
module.exports=function(app){
    app.get('/ShiftTotal',ShiftTotal.ShiftTotal);
    app.post('/ShiftTotal/:method',ShiftTotal.fun);
    app.get('/ShiftTotal/:method',ShiftTotal.fun);



}