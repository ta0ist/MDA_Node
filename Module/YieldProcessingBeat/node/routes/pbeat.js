var pbeatctrl = require('../controller/ProcessingBeat.js');

module.exports = function (app) {

    //加载页面
    app.get('/pbeat', pbeatctrl.index);
    //各种事件
    app.post('/pbeat/:method',pbeatctrl.fun);

    app.get('/pbeat/:method',pbeatctrl.fun);
}
