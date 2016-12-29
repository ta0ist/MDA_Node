/**
 * Created by qb on 2016/11/30.
 */
var MachineYieldctrl=require('../controller/MachineYield');
module.exports=function(app){
    app.get('/MachineYield',MachineYieldctrl.MachineYield);
    app.get('/OutPutIndexYield',MachineYieldctrl.OutPutIndexYield);
    app.post('/MachineYield/:method',MachineYieldctrl.fun);
    app.get('/MachineYield/:method',MachineYieldctrl.fun);
}