let config = require('../../../routes/config');
let post_argu = require('../../../routes/post_argu');
var request = require('request');
const WebSocket = require('ws');
const _ = require('underscore');
module.exports = function(app) {
    let WebSocketServer = require('ws').Server;
    global.Client = [];
    global.ws = new WebSocketServer({
        port: config.Notice.webscoketPort
            // verifyClient: socketVerify
    });
    global.ws.on('connection', (result, req) => {
        console.log('client connected');
        for (let i = 0; i < global.Client.length; i++) {
            if (global.Client[i].IP == post_argu.GetIP(req.connection.remoteAddress)) {
                global.Client[i].ClientId.push(result._ultron.id);
                global.Client[i].ClientId = _.uniq(global.Client[i].ClientId);
            }
        }
        result.on('message', function(message) {
            let mes = JSON.parse(message);
            var args = [];
            args.push(mes.method);
            args.push(mes);
            global.Client.push(this);
            doCallback(eval(mes.method), args);
        });

    })


    function doCallback(fn, args) {
        fn.apply(args[0], args);
    }

    //设置广播
    function SetNotice(method, args) {
        global.ws.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(args.Data);
            }
        })
    }

    //注册
    function Reg(method, args) {
        return null;
    }


}