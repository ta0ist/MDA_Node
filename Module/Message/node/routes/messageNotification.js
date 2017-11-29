var MessageNotification = require('../controller/MessageNotification.js');
module.exports = function(app) {
    app.get('/MessageNotification', MessageNotification.MessageNotification);
    app.get('/MessageNotification/getConfig', MessageNotification.getConfig);
    app.post('/MessageNotification/setConfig', MessageNotification.setConfig);

    app.post('/MessageNotification/StartService', MessageNotification.StartService);
    app.post('/MessageNotification/StopService', MessageNotification.StopService);
    app.post('/MessageNotification/sendMessage', MessageNotification.sendMessage);

    app.post('/MessageNotification/:method', MessageNotification.fun);
    app.get('/MessageNotification/:method', MessageNotification.fun);




}