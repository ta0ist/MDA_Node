var EmployeePerformance={}
EmployeePerformance.OnlineOrOffline=require('./routes/OnlineOrOffline');
EmployeePerformance.OnlineDetails=require('./routes/OnlineDetails');
EmployeePerformance.MachineWorkingState=require('./routes/MachineWorkingState');
EmployeePerformance.MachineYield=require('./routes/MachineYield');
module.exports=function(app){
    EmployeePerformance.OnlineOrOffline(app);
    EmployeePerformance.OnlineDetails(app);
    EmployeePerformance.MachineWorkingState(app);
    EmployeePerformance.MachineYield(app);
}
