var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ejs = require('ejs'),fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var upload=(function(){
//  app.post('/upload', multipart(), function(req, res){
//    console.log( req.files,req.files.fulAvatar.originalFilename, path.basename(req.files.fulAvatar.path));
//    //get filename
//    var filename = req.files.fulAvatar.originalFilename || path.basename(req.files.fulAvatar.path);
//    console.log(filename);
//    //copy file to a public directory
//    var targetPath = path.dirname(__filename) + '/public/' + filename;
//    console.log(targetPath);
//    //copy file
//    fs.createReadStream(req.files.fulAvatar.path).pipe(fs.createWriteStream(targetPath));
//    //return file url
//    res.json({code: 200, msg: {url: 'http://' + req.headers.host + '/' + filename}});
//  });
//})();

//var yunspace = require('./routes/yunspace');
//var sockets= require('./socket.core');
//var upload=require('./plugin/upload');
var uploads=require('./routes/upload');

app.listen(2000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', yunspace);
app.use(uploads);
console.log('正在监听端口3000');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
