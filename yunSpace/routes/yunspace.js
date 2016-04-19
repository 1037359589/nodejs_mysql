var express = require('express');
var router = express.Router();
var path=__dirname;
var mysql=require('mysql');
var core=require("../core");
var TEST_TABLE='yun_account';
function a(name){
    this.name=name;
}
console.log(core.getInstance(a,'xiaohong'));

core.requestUrl(router,true,'login',function(req,res,next,connection){
    core.select(connection,
        {
            table:'yun_account',
            cols:['id as i','username as name',"phone"],
            additions:'id<50',
            //limit:20,
            //offset:10,
            //group:'',
            order:'id desc'
        },
        function(results,fields){
        res.render('admin/login/index', { users: results});
    });
});


module.exports = router;
