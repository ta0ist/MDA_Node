var configDetails = require('../controller/configDetailsController.js');
module.exports = function(app) {
    app.get('/configDetails', configDetails.configDetails);
    app.post('/configDetails/:method', configDetails.fun);
    app.get('/configDetails/:method', configDetails.fun);
    app.post('/configDetails/r/getData', configDetails.getData);
    app.post('/configDetails/r/addData', configDetails.addData);
    app.post('/configDetails/r/getToolsData', configDetails.getToolsData);
    app.post('/configDetails/r/edit', configDetails.edit);
    app.post('/configDetails/r/delete', configDetails.delete);
}