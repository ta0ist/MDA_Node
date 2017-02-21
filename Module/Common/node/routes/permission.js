var permissonctrl = require('../controller/permission');
module.exports = function(app) {
    app.get('/permission', permissonctrl.index);

    app.get('/P_GetSubMenu', permissonctrl.P_GetSubMenu);

    app.get('/Common/PeopleManageGroup/FindSubUserGroupByParentIdRecycle', permissonctrl.FindSubUserGroupByParentIdRecycle);

    app.post('/GetUserGroupAccredit', permissonctrl.GetUserGroupAccredit);

    app.post('/GetUserAccredit', permissonctrl.GetUserAccredit);

    app.post('/AddGroupFun', permissonctrl.AddGroupFun);

    app.post('/AddUserFun', permissonctrl.AddUserFun);
}