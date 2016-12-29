/**
 * Created by qb on 2016/12/2.
 */
var operationratioformulactrl=require('../controller/OperationRatioFormula');
module.exports=function(app){
    app.get('/OperationRatioFormula',operationratioformulactrl.operationratioformula);
    app.get('/OperationRatioFormula/:method',operationratioformulactrl.fun);
    app.post('/OperationRatioFormula/:method',operationratioformulactrl.fun);
}