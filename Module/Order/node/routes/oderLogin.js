/**
 * Created by qb on 2016/12/20.
 */
var OrderLogin=require('../controller/OrderLogin.js');
module.exports=function(app){
    app.get('/OrderLogin',OrderLogin.OrderLogin);
    //app.get('/OutPutIndex',MachineWorkingStatectrl.OutPutIndex);
    app.post('/OrderLogin/:method',OrderLogin.fun);
    app.get('/OrderLogin/:method',OrderLogin.fun);



}