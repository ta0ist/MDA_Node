let path = require('path');
let fs = require('fs');
let request = require('request');
let config = require('../../../../routes/config.js')
let post_argu = require('../../../../routes/post_argu.js');


exports.index = (req, res) => {
    if (!req.session.menu) {
        res.redirect('/');
    } else {

        res.render(path.resolve(__dirname, '../../web/view/DNC/index'), {
            menulist: req.session.menu,
            user: req.session.user,
            lang: post_argu.getLanguage(),
            path: config.DNCPath
        });
    }

}

exports.SendProgram = (req, res) => {
    fs.exists(config.DNCPath, (result) => {
        if (!result) {
            fs.mkdirSync(config.DNCPath);
        }
        let method = global.Webservice + '/MachineParameters/Diagnosis.asmx/SendProgram';
        req.body.FullFileName = config.DNCPath + req.body.FullFileName;
        post_argu.post_argu(res, method, req.body);
    })
}

exports.ReceviceProgram = (req, res) => {
    fs.exists(config.DNCPath, (result) => {
        if (!result) {
            fs.mkdirSync(config.DNCPath);
        }
        let method = global.Webservice + '/MachineParameters/Diagnosis.asmx/RecevieProgram';
        req.body.path = config.DNCPath + req.body.FileName;
        post_argu.post_argu(res, method, req.body);
    })
}