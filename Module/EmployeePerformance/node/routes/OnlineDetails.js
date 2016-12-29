/**
 * Created by qb on 2016/11/29.
 */
var OnlineDetailsctrl=require('../controller/OnlineDetails.js');
module.exports=function(app){
    app.get('/OnlineDetails',OnlineDetailsctrl.OnlineDetails);
    app.post('/OnlineDetails/:method',OnlineDetailsctrl.fun);
}