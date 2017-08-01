var path = require('path')
var post_argu = require('../../../../routes/post_argu.js')
module.exports = (app) => {
    app.get('/MachinePere', (req, res) => {
        //res.render(path.resolve(__dirname, '../../web/view/MachinePara/index'));
        post_argu.permission(req, res, '/MachinePara', 'view', path.resolve(__dirname, '../../web/view/MachinePara/index'));
    })
}