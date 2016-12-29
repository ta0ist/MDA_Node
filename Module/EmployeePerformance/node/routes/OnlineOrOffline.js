/**
 * Created by qb on 2016/11/29.
 */
var OnlineOrOfflinectrl=require('../controller/OnlineOrOffline');
module.exports=function(app){
    app.get('/OnlineOrOffline',OnlineOrOfflinectrl.OnlineOrOfflinectrl);
    app.post('/OnlineOrOffline/:method',OnlineOrOfflinectrl.fun);

}