/**
 * Created by bll on 16/4/26.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require('express');
var router = express.Router();
var path=__dirname;
var core=require("./core");
var mysql=require('mysql');

server.listen(8080);
var connection=mysql.createPool(({
    host:'127.0.0.1',
    user:'root',
    password : '919927',
    port: '3306',
    database: 'test'
}));




core.requestUrl(router,false,'test',function(req,res,next,connection){

});
connection.getConnection(function(err, connection) {
    core.select(connection,
        {
            table:'account',
            cols:['id as i','username as name',"phone"],
            additions:'username="yumi"',
            //limit:20,
            //offset:10,
            //group:'',
            order:'id desc'
        },
        function(results,fields,connection){
            console.log(results);
            //if(results.name==name){
            //    connection.destroy();
            //}
            io.on('connection', function (socket) {
                console.log('listen');
                socket.emit('news', results);
                socket.on('my other event', function (results) {
                    console.log(results);
                });
            });
            //res.render('admin/login/index', { users: results});
        });

});
