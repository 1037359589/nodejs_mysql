var express = require('express');
var router = express.Router();
var path=__dirname;
var mysql=require('mysql');
var core=require("../core");
var TEST_TABLE='yun_account';
var accounts=require("../data_table_config/yun_accounts");
function a(name){
    this.name=name;
}
console.log(typeof 10,222);
console.log(core.getInstance(a,'xiaohong'));
var name = 'pzl';
core.requestUrl(router,true,'login',function(req,res,next,connection){
    core.insert(connection,
        {
            table:'yun_accounts',
            cols:['username',"phone",'sex','age'],
            value:[name,'15002119191','男','9'],
            alterCols:accounts
        },function(results){
            //console.log(results);
        });
    core.select(connection,
        {
            table:'yun_account',
            cols:['id as i','username as name',"phone"],
            additions:'username="'+name+'"',
            //limit:20,
            //offset:10,
            //group:'',
            order:'id desc'
        },
        function(results,fields,connection){
            //console.log(results);
            //if(results.name==name){
            //    connection.destroy();
            //}
            res.render('admin/login/index', { users: results});
        });

});


module.exports = router;
