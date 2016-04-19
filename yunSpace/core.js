/**
 * Created by bll on 16/4/19.
 */
var mysql=require('mysql');
var util = require('util');
var core=(function(){
    return {
        ROOT:__dirname,
        /*
        * 单例模式
        * @obj 对象(obj)
        * @args 对象初始化参数(obj)
        * */
        getInstance: function (obj,args) {
            var instance;
            if (instance === undefined) {
                instance = new obj(args);
            }
            return instance;
        },
        /*
        * 路由请求
        * @router express.Router()对象(obj)
        * @isAdmin 是否是后台路径(bool)
        * @file 后端路由
        * @fn 请求回调函数
        * */
        requestUrl:function(router,isAdmin,file,fn){
            if(isAdmin){
                router.get("/admin/"+file,function(req,res,next){
                    var connection=mysql.createConnection(({
                        host:'127.0.0.1',
                        user:'root',
                        password : '919927',
                        port: '3306',
                        database: 'test'
                    }));
                    if(fn instanceof Function){
                        fn(req,res,next,connection);
                    }
                });
            }else{
                router.get(file,function(req,res,next){
                    var connection=mysql.createConnection(({
                        host:'127.0.0.1',
                        user:'root',
                        password : '919927',
                        port: '3306',
                        database: 'test'
                    }));
                    if(fn instanceof Function){
                        fn(req,res,next);
                    }
                });
            }
        },
        /*
        * 查询数据库
        * @connect 数据库连接对象(obj)
        * @table 数据表
        * @cols 需要查询的字段(array)
        * @additions 条件语句
        * @limit 查询条数限制
        * @group 根据group by
        * @order 根据order by
        * @offset 查询偏移量
        * @fn 完成查询后的回调函数
        * */
        select:function(connect,sqlObj,fn){
            var limitStr=sqlObj.limit==(""||undefined)?"":' limit '+sqlObj.limit,
                offsetStr=sqlObj.offset==(""||undefined)?"":' offset '+sqlObj.offset,
                groupStr=sqlObj.group==(""||undefined)?" ":' group by '+sqlObj.group,
                orderStr=sqlObj.order==(""||undefined)?" ":' order by '+sqlObj.order,
                colsStr;
            if(util.isArray(sqlObj.cols)){
                colsStr=sqlObj.cols.join(",");
            }else{
                colsStr="*";
            }
            var sql= 'SELECT '+colsStr+' FROM '+sqlObj.table+' WHERE '+sqlObj.additions+groupStr+orderStr+limitStr+offsetStr;
            console.log(sql);
            connect.query(
                sql,
                function selectCb(err, results, fields) {
                    console.log(err);
                    if (err) {
                        throw err;
                    }
                    if(fn instanceof Function){
                        fn(results,fields);
                    }
                    connect.end();
                }
            );
        },
        insert:function(){

        },
        delete:function(){

        },
        update:function(){

        }
    }
}());
module.exports=core;
