/**
 * Created by qb on 2016/11/28.
 */
var statusratectrl=require('../controller/statusrate.js');
module.exports=function(app){
    app.get('/statusrate',statusratectrl.statusrate);
    app.post('/statusrate/:method',statusratectrl.fun);
    app.get('/statusrate/:method',statusratectrl.fun);

}