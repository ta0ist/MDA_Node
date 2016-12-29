
var Reports = {};
Reports.educe = require('./routes/educe.js');



module.exports = function (app) {
    Reports.educe(app);
   
}