
var MachineStatus = {};
MachineStatus.statusrate=require('./routes/statusrate.js');

module.exports = function (app) {
    MachineStatus.statusrate(app);
}