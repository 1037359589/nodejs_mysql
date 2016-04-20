/**
 * Created by bll on 16/4/19.
 */
var mysql=require('mysql');
var util = require('util');
var core=(function(){
    function createTable(connect,sqlObj){
        var prefixTable="yun_";
        var createTable="CREATE TABLE IF NOT EXISTS `"+prefixTable+sqlObj.alterCols.table+"`("+
            "`id`  int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT  '唯一编号，自增长'," +
            "PRIMARY KEY `id` (`id`)"+
            ") ENGINE=MyISAM  DEFAULT CHARSET=utf8  AUTO_INCREMENT= 1 ";
        console.log(createTable);
        connect.query(createTable,function(err){
            if (err) {
                throw err;
            }
            var cols=sqlObj.alterCols.constructor.cols;
            for(var k in cols){
                addAlterCols(sqlObj.alterCols.table,cols[k].colName,cols[k].type,cols[k].index,cols[k].title,connect);
            }
        });
    }
    function addAlterCols(table,colName,type,index,title,connect){
        console.log(4444);
        var col=colName==undefined?console.error('ERROR:字段名称不存在!!'):colName,ty,ind,
            tit=title==undefined?"":' COMMENT "'+title+'"';
        if(type==undefined){
            console.error('ERROR:字段类型不存在!!');
        }else{
            switch (typeof type){
                case 'string':
                    ty=" "+type;
                    break;
                case 'number':
                    ty=' varchar('+type+')';
                    break;
            }
            var sql='ALTER TABLE yun_'+table+' ADD '+col+ty+tit;
            console.log(sql);
            connect.query(sql,function(err){
                if (err) {
                    console.log("ERROR-:"+err.message,1);
                    //throw err;
                }
                //connect.release()
            });
            if(index!=undefined||""){
                var sql1;
                switch (index){
                    case 'u':
                        sql1='ALTER TABLE yun_'+table+' ADD unique emp_name('+col+')';
                        break;
                    case 'i':
                        sql1='ALTER TABLE yun_'+table+' add index index_name('+col+')';
                        break;
                }
                console.log(sql1);
                connect.query(sql1,function(err){
                    if (err) {
                        console.log("ERROR-:"+err.message,2);
                        //throw err;
                    }
                    //connect.release();
                });
            }



        }


    }
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
                    var connection=mysql.createPool(({
                        host:'127.0.0.1',
                        user:'root',
                        password : '919927',
                        port: '3306',
                        database: 'test'
                    }));
                    if(fn instanceof Function){
                        connection.getConnection(function(err, connection) {
                            fn(req,res,next,connection);
                        });
                    }
                });
            }else{
                router.get(file,function(req,res,next){
                    var connection=mysql.createPool(({
                        host:'127.0.0.1',
                        user:'root',
                        password : '919927',
                        port: '3306',
                        database: 'test'
                    }));
                    if(fn instanceof Function){
                        connection.getConnection(function(err, connection) {
                            fn(req,res,next,connection);
                        });
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
                function(err, results, fields) {
                    if (err) {
                        console.log('[SELECT ERROR]-'+err.message);
                    }
                    if(fn instanceof Function){
                        fn(results,fields,connect);
                    }
                    connect.end();
                }
            );
        },
        insert:function(connect,sqlObj,fn){
            createTable(connect,sqlObj);
            if(sqlObj.cols.length!=sqlObj.value.length){
                console.error('数组长度不统一!!');
                return;
            }
            var colsStr=util.isArray(sqlObj.cols)?sqlObj.cols.join(","):false;
            var valueStr=util.isArray(sqlObj.value)?sqlObj.value.join(","):false;
            if(!colsStr||!valueStr){
                console.error('字段和value必须为数组!!');
                return;
            }
            valStr="";
            for(var k in sqlObj.cols){
                valStr+="?,";
            }
            valStr=valStr.substring(0,valStr.length-1);
            var sql='INSERT INTO '+sqlObj.table+' ('+colsStr+') VALUES ('+valStr+')';
            console.log(sql);
            console.log(sqlObj.value);
            connect.query(
                sql,sqlObj.value,
                function(err, results) {
                    console.log(1212121);
                    if (err) {
                        console.log('[INSERT ERROR]-'+err.message);
                        return;
                    }
                    if(fn instanceof Function){
                        fn(results,connect);
                    }
                    //connect.release()
                }
            );
        },
        delete:function(connect,sqlObj,fn){

        },
        update:function(connect,sqlObj,fn){

        }

    }
}());
module.exports=core;
