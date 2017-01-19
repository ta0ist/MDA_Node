var toolConfig = require('../controller/toolConfigController.js');
module.exports = function(app) {
    app.get('/toolConfig', toolConfig.toolConfig);
    app.post('/toolConfig/:method', toolConfig.fun);
    app.get('/toolConfig/:method', toolConfig.fun);
    app.post('/toolConfig/r/getTool', toolConfig.getTool);
    app.post('/toolConfig/r/add', toolConfig.add);
    app.post('/toolConfig/r/edit', toolConfig.edit);
    app.post('/toolConfig/r/delete', toolConfig.delete);
    app.post('/toolConfig/r/deleteAll', toolConfig.deleteAll);
    app.post('/toolConfig/r/search', toolConfig.search);
}