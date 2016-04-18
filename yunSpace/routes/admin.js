var express = require('express');
var router = express.Router();
var path=__dirname;
var mysql=require('mysql');
var TEST_TABLE='yun_account';

/* GET home page. */
router.get('/', function(req, res, next) {
  var connection=mysql.createConnection(({
    host:'127.0.0.1',
    user:'root',
    password : '919927',
    port: '3306',
    database: 'test'
  }));
  connection.query(
      'SELECT * FROM '+TEST_TABLE,
      function selectCb(err, results, fields) {
        if (err) {
          throw err;
        }
         console.log(res);
        res.render('index', { users: results});
        connection.end();
      }
  );

});
router.get('/login',function(req,res,next){
  res.render('index', { title: 'asdasdas'});
});

router.get("/header",function(req,res,next){
  res.render('Admin/index', { title: 'Express'});
});


module.exports = router;
