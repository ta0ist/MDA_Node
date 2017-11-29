var Message = {}
Message.MessageNotification = require('./routes/messageNotification.js');
module.exports = function(app) {
    Message.MessageNotification(app);

}