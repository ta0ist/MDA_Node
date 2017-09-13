let path = require('path');
let request = require('request');
let post_argu = require('../../../../routes/post_argu.js');


exports.index = (req, res) => {
    if (!req.session.menu) {
        res.redirect('/');
    }
    res.render(path.resolve(__dirname, '../../web/view/DNC/index'), {
        menulist: req.session.menu,
        user: req.session.user,
        lang: post_argu.getLanguage(),
    });
}

exports.SendProgram = (req, res) => {
    let method = global.Webservice + '/MachineParameters/Diagnosis.asmx/SendProgram';
    req.body.FullFileName = path.resolve('./public/program/', req.body.FullFileName);
    post_argu.post_argu(res, method, req.body);
}

exports.ReceviceProgram = (req, res) => {
    let method = global.Webservice + '/MachineParameters/Diagnosis.asmx/RecevieProgram';
    req.body.path = path.resolve('./public/program/', req.body.FileName);
    post_argu.post_argu(res, method, req.body);
}