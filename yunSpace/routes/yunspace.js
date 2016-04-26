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
var changeName='pzlbll';
core.requestUrl(router,true,'login',function(req,res,next,connection){
    //core.insert(connection,
    //    {
    //        table:'accounts',
    //        cols:['username',"phone",'sex','age'],
    //        value:[name,'15002119191','男','9'],
    //        alterCols:accounts
    //    },function(results){
    //        //console.log(results);
    //    });/
    core.select(connection,
        {
            table:'account',
            cols:['id as i','username as name',"phone"],
            additions:'username="'+name+'"',
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
            res.render('admin/login/index', { users: results});
        });
    ////core.update(connection,{
    ////    table:'accounts',
    ////    cols:['username',"phone",'sex','age'],
    ////    value:[changeName,'15002114175','男','10'],
    ////    additions:'username="'+name+'"'
    ////    //order:'id desc',
    ////    //limit:20,
    ////},function(result,connect){
    ////    console.log(result);
    ////});
    //core.delete(connection,{
    //    table:'accounts',
    //    additions:'username="'+changeName+'"'
    //},function(result,connect){
    //
    //})
});
/*
*
* next('route') 跳路由访问
* */
//router.use('admin/test/:id', function (req, res, next) {
//    console.log('Request Type:', req.method);
//    next();
//});

//core.requestUrl(router,true,'test/:id',function(req,res,next,connection){
//    if (req.params.id == 0){
//        console.log(req.params.id,12312);
//        res.render('admin/test', { users: "pzlpzl"});
//    }else    next('route');
//});
//core.requestUrl(router,true,'test/:id',function(req,res,next,connection){
//    if (req.params.id == 1){
//        console.log(req.params.id,123192922);
//        res.render('admin/special');
//    }else{
//        next('route');
//    }
//
//});
//
//core.requestUrl(router,true,'test/:id',function(req,res,next,connection){
//    res.render('admin/special2');
//});
//
//core.requestUrl(router,true,'',function(req,res,next,connection){
//
//    console.log('listen',1);
//
//    res.render('Admin/index_one.html', { users: "pzlpzl"});
//});


module.exports = router;
