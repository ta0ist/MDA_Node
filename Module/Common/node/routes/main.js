/**
 * Created by qb on 2016/12/13.
 */
var Main=require('../controller/Main');
module.exports=function(app){
    app.get('',Main.main);
    app.post('/Main/:method',Main.fun);
    app.get('/Main/:method',Main.fun);
}