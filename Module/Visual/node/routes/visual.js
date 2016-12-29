var visual = require('../controller/Visual.js');

module.exports = function (app) {

    //加载页面
    app.get('/visuals', visual.index);

    //读取加载文件
    app.get('/visuals/r/ReadyFile', visual.ReadyFile);
    //获取状态
    app.get('/visuals/r/GetStatus', visual.GetStatus);

    //获取状态
    app.get('/visuals/r/GetImmediateState', visual.GetImmediateState);

    //获取产量
    app.get('/visuals/r/GetYieldByProgramRate', visual.GetYieldByProgramRate);

    //获取稼动率
    app.get('/visuals/r/GetMachineHourYield', visual.GetMachineHourYield);

    //获取班次状态
    app.get('/visuals/r/GetMachineShifStatuRate',visual.GetMachineShifStatuRate);

     //获取稼动率
    app.get('/visuals/r/GetShiftActivation',visual.GetShiftActivation);

    //班次效率汇总饼图
    app.get('/visuals/r/GetThisShiftStatuRate',visual.GetThisShiftStatuRate);
    

}
