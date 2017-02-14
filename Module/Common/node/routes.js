var Common = {};
Common.login = require('./routes/Login.js');
Common.account = require('./routes/Account.js');
Common.machine = require('./routes/machine.js');
Common.member = require('./routes/member.js');
Common.fclendar = require('./routes/FactoryCalendar.js');
Common.operationratioformula = require('./routes/operationratioformula.js');
Common.factory = require('./routes/factory.js');
Common.Alarm = require('./routes/Alarm.js');
Common.Shift = require('./routes/Shift.js');
Common.StatusDetail = require('./routes/StatusDetail.js');
Common.StatusData = require('./routes/statusdata.js');
Common.Main = require('./routes/main.js');
Common.Permission = require('./routes/Permission.js');

module.exports = function(app) {
    Common.login(app);
    Common.account(app);
    Common.machine(app);
    Common.member(app);
    Common.fclendar(app);
    Common.factory(app);
    Common.Alarm(app);
    Common.Shift(app);
    Common.StatusDetail(app);
    Common.operationratioformula(app);
    Common.StatusData(app);
    Common.Main(app);
    Common.Permission(app);
}