var cut = require('../controller/cutController.js');
module.exports = function(app) {
    app.get('/cuttool', cut.Index);

    app.get('/product', cut.product);

    app.post('/get_TOOLS_MEASURED', cut.get_TOOLS_MEASURED);
}