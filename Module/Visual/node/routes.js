var visual = {};
visual.visual = require('./routes/visual.js');
visual.notice = require('./routes/notice.js');
module.exports = function(app) {
    visual.visual(app);
    visual.notice(app);
}