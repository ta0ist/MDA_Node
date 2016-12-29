/**
 * Created by qb on 2016/12/21.
 */
var ProductMaintenance=require('../controller/ProductMaintenance.js');
module.exports=function(app){
    app.get('/ProductMaintenance',ProductMaintenance.ProductMaintenance);
    app.post('/ProductMaintenance/:method',ProductMaintenance.fun);
    app.get('/ProductMaintenance/:method',ProductMaintenance.fun);
}