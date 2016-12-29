/**
 * Created by qb on 2016/12/21.
 */
var Defective=require('../controller/Defective.js');
module.exports=function(app){
    app.get('/Defective',Defective.Defective);
    app.post('/Defective/:method',Defective.fun);
    app.get('/Defective/:method',Defective.fun);
}