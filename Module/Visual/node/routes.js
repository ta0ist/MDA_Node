
var visual = {};
visual.visual = require('./routes/visual.js');
module.exports = function (app) {
    visual.visual(app);
}
