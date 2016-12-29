/**
 * Created by qb on 2016/11/16.
 */
var factoryctrl=require('../controller/factory');
module.exports=function(app){
    app.get('/factory',factoryctrl.factory);
    app.post('/GetWorkPlaceNbrs',factoryctrl.GetWorkPlaceNbrs);
    app.post('/UpdateOrderedDiv',factoryctrl.UpdateOrderedDiv);
    app.post('/GetImmediateState',factoryctrl.GetImmediateState);
}