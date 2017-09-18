var loginctrl = require('../controller/Login.js');
var session = require('express-session');

module.exports = function(app) {
    //主页面
    app.get('/', loginctrl.main);
    //登陆页面
    app.get('/login', loginctrl.loginpage);
    //登出页面
    app.get('/logout', loginctrl.logout);
    //验证用户
    app.post('/checkuser', loginctrl.checkuser);
    //加载菜单
    app.get('/loadmenu', loginctrl.loadmenu);
    //保存菜单
    app.get('/save/:id', loginctrl.savemenu);
    //设置中文
    app.get('/set_lang_cn', function(req, res) {
        session.language = 'cn.js';
        res.redirect('/login');
    });
    //设置英文
    app.get('/set_lang_en', function(req, res) {
        session.language = 'en.js';
        res.redirect('/login');
    });
    //设置日文
    app.get('/set_lang_jp', function(req, res) {
        session.language = 'jp.js';
        res.redirect('/login');
    });

}