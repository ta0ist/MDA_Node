let config = require('../../../routes/config')
module.exports = function(app) {
    let WebSocketServer = require('ws').Server;
    global.ws = new WebSocketServer({
        port: config.Notice.webscoketPort
            // verifyClient: socketVerify
    });
    global.ws.on('connection', (result) => {
        console.log('client connected');
        result.on('message', function(message) {
            let mes = JSON.parse(message);
            console.log(mes);
            if (mes.Type = 1) {
                global.ws.clients.forEach(function each(client) {
                    client.send(mes.Data);
                })
            }

        });

    })
}