let notice = require('../controller/Visual')


module.exports = function(app) {
    app.get('/notices', notice.noticeindex);

    app.post('/visuals/r/DeleteNews', notice.DeleteNews);

    app.post('/visuals/r/ModifyNews', notice.ModifyNews);

    app.get('/visuals/r/GetNoticeActive', notice.GetNoticeActive);

    app.post('/visuals/r/AddNews', notice.AddNews);
}