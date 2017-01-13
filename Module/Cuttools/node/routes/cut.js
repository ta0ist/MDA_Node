var cut = require('../controller/cutController.js');
module.exports = function(app) {
    app.get('/cuttool', cut.Index);
}