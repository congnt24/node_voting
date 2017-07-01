/**
 * Created by apple on 6/29/17.
 */
"use strict";

require('babel-register')
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var logger = require('morgan')
var path = require('path')
var cookieParser = require('cookie-parser')
var db = require('./db')
var config = require('./configs/config')
var app = express()



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//setup middleware
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//setup session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.use(require('./middlewares/authentication'))
//routing
app.use(require('./routes'))

//initialize db
db.connect(config.mongo.url, err => {
    if (err) {
        console.error('Unable to connect to mongo DB')
        process.exit(1)
    }else{
        console.log('DB connection successful');
    }
})





//catch error
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
app.listen(3000)