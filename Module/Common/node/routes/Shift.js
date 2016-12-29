/**
 * Created by qb on 2016/11/24.
 */
var shiftctrl=require('../controller/shift.js');
module.exports=function(app){
    app.get('/shift',shiftctrl.shift);
    app.get('/ArrangeIndex',shiftctrl.ArrangeIndex);
    app.post('/shift/:method',shiftctrl.fun);
    app.get('/shift/:method',shiftctrl.fun);
}