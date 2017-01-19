var cuttools = {};
cuttools.Cut = require('./routes/cut.js');
cuttools.ToolConfig = require('./routes/toolConfig');
cuttools.ConfigDetails = require('./routes/configDetails')
module.exports = function(app) {
    cuttools.Cut(app);
    cuttools.ToolConfig(app);
    cuttools.ConfigDetails(app);
}