/**
 * Created by bll on 16/4/21.
 */
var mysql=require('mysql');
var util = require('util');
var core=(function(){
    var sqlQuery= {};
    var sqlMethod= {
        isTable:false,
        sqlQuery: function (connect, sql, fn) {
            connect.query(sql, function (err, results, field) {
                if (err) {
                    console.log("ERROR:" + err.message);
                }
                if (fn instanceof Function) {
                    fn(err, results, field);
                }
            });
        },
        createTable: function(connect,sqlObj){
            var __self=this;
            var prefixTable="yun_";
            var createTable="CREATE TABLE IF NOT EXISTS `"+prefixTable+sqlObj.alterCols.table+"`("+
                "`id`  int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT  '唯一编号，自增长'," +
                "PRIMARY KEY `id` (`id`)"+
                ") ENGINE=MyISAM  DEFAULT CHARSET=utf8  AUTO_INCREMENT= 1 ";
            console.log(createTable);
            //connect.query(createTable,function(err){
            //    if (err) {
            //        throw err;
            //    }
            //    var cols=sqlObj.alterCols.constructor.cols;
            //    for(var k in cols){
            //        isSetColName(connect,prefixTable+sqlObj.alterCols.table,cols[k]);
            //    }
            //});
            __self.sqlQuery(connect,createTable,function(err,results){
                    var cols=sqlObj.alterCols.constructor.cols;
                    for(var k in cols){
                        __self.isSetColName(connect,prefixTable+sqlObj.alterCols.table,cols[k]);
                    }
                });
        },
        isSetColName:function(connect,table,col){
            var __self=this;
            var sql2='desc `'+table+'` '+col.colName;
            //connect.query(sql2,function(err,results){
            //    if (err) {
            //        throw err;
            //    }
            //    if(results.length==0||results==undefined){
            //        addAlterCols(table,col.colName,col.type,col.index,col.title,connect);
            //    }
            //});
            __self.sqlQuery(connect,sql2,function(err,results){
                if(results.length==0||results==undefined){
                    __self.addAlterCols(table,col.colName,col.type,col.index,col.title,connect);
                }
            });
        },
        addAlterCols:function(table,colName,type,index,title,connect){
            var __self=this;
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
                var sql='ALTER TABLE '+table+' ADD '+col+ty+tit;
                console.log(sql);
                //connect.query(sql,function(err){
                //    if (err) {
                //        console.log("ALTER-ERROR:"+err.message);
                //        //throw err;
                //    }
                //    //connect.release()
                //});
                __self.sqlQuery(connect,sql);
                if(index!=undefined||""){
                    var sql1;
                    switch (index){
                        case 'u':
                            sql1='ALTER TABLE '+table+' ADD unique emp_name('+col+')';
                            break;
                        case 'i':
                            sql1='ALTER TABLE '+table+' add index index_name('+col+')';
                            break;
                    }
                    console.log(sql1);
                    connect.query(sql1,function(err){
                        if (err) {
                            console.log("ALTER-ERROR:"+err.message);
                            //throw err;
                        }
                        //connect.release();
                    });
                }
                __self.isTable=true;
            }
        },
        isSetTable: function(connect,sqlObj){
            var __self=this;
            var sql='SHOW TABLES LIKE "'+sqlObj.table+'"';
            console.log(sql);
            //connect.query(sql,function(err,results){
            //    if(results.length==0||results==undefined){
            //        createTable(connect,sqlObj);
            //    }else{
            //        isTable=true;
            //    }
            //});
            __self.sqlQuery(connect,sql,function(err,results){
                if(results.length==0||results==undefined){
                    __self.createTable(connect,sqlObj);
                }else{
                    isTable=true;
                }
            });
        },
        fn1:function(){
            console.log(this.isTable);
            console.log(12312312);
        }
    };
    function clone(obj){
        var ret, k,b;
        if((b=(obj instanceof Array))||obj instanceof Object){
            ret=b?[]:{};
            for(k in obj){
                if((obj[k] instanceof Array)||obj[k] instanceof Object){
                    ret[k]=clone(obj[k]);
                }else{
                    ret[k]=obj[k];
                }
            }
        }
        return ret;
    }
    //sqlQuery=clone(sqlMethod);
    //sqlQuery.fn2=function(){
    //    console.log(1221);
    //};
    //console.log(sqlQuery);
    //console.log(sqlMethod);
     sqlQuery=Object.create(sqlMethod,{
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
             //connect.query(
             //    sql,
             //    function(err, results, fields) {
             //        if (err) {
             //            console.log('[SELECT ERROR]-'+err.message);
             //        }
             //        if(fn instanceof Function){
             //            fn(results,fields,connect);
             //        }
             //        connect.end();
             //    }
             //);
             this.sqlQuery(connect,sql,function(err,results,fields){
                 if(fn instanceof Function){
                     fn(results,fields,connect);
                 }
                 connect.end();
             });
         },
         insert:function(connect,sqlObj,fn){
             var __self=this;
             var t=setInterval(function(){
                 __self.isSetTable(connect,sqlObj);
                 if(__self.isTable){
                     clearInterval(t);
                     if(__self.isTable){
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
                         var valStr="";
                         for(var k in sqlObj.cols){
                             valStr+="?,";
                         }
                         valStr=valStr.substring(0,valStr.length-1);
                         var sql='INSERT INTO '+sqlObj.table+' ('+colsStr+') VALUES ('+valStr+')';
                         console.log(sql);
                         connect.query(
                             sql,sqlObj.value,
                             function(err, results) {
                                 if (err) {
                                     console.log('[INSERT ERROR]-'+err.message);
                                 }
                                 if(fn instanceof Function){
                                     fn(results,connect);
                                 }
                                 //connect.release()
                             }
                         );
                     }
                 }
             },100);

             //createTable(connect,sqlObj);

         },
         delete:function(connect,sqlObj,fn){

         },
         update:function(connect,sqlObj,fn){

         }

     });
    return sqlQuery;
})();
module.exports=core;