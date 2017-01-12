var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./routes/config.js')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('views', path.join(__dirname, 'Module'));
app.set('view engine', 'jade');

app.use(session({
    cookieName: 'session',
    secret: 'someRandomSecret!',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
}));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Module')));
app.use(express.static(path.join(__dirname, 'ExcelFile')));
var routes = require('./routes/index.js');
routes(app);

// catch 404 and forward to error handler
app.get('*', function(req, res) {
    res.render('404', {
        title: 'No Found'
    })
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// app.listen(3000,function(){

//     console.log('server start ...');
// });
global.Webservice = 'http://' + config.webIP + ':' + config.webPort + '/Modules';
module.exports = app;