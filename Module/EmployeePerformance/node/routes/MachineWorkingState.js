/**
 * Created by qb on 2016/11/30.
 */
var MachineWorkingStatectrl=require('../controller/MachineWorkingState');
module.exports=function(app){
    app.get('/MachineWorkingState',MachineWorkingStatectrl.MachineWorkingState);
    app.get('/OutPutIndex',MachineWorkingStatectrl.OutPutIndex);
    app.post('/MachineWorkingState/:method',MachineWorkingStatectrl.fun);
    app.get('/MachineWorkingState/:method',MachineWorkingStatectrl.fun);
}