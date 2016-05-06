/**
 * Created by bll on 16/4/19.
 */
var mysql=require('mysql');
var util = require('util');
var multiparty = require('multiparty');
var fs = require('fs');
var core=(function(){
    var isTable=false;
    var prefixTable="yun_";
    /*sql语句执行*/
    function sqlQuery(connect,sql,fn){
        connect.query(sql,function(err,results,field){
            if (err) {
                console.log("ERROR:"+err.message);
            }
            if(fn instanceof Function){
                fn(err,results,field);
            }
        });
    }
    /*
    * 创建表
    * @connect 数据库的链接对象
    * @sqlObj 传入的参数
    * */
    function createTable(connect,sqlObj){
        var createTable="CREATE TABLE IF NOT EXISTS `"+prefixTable+sqlObj.table+"`("+
            "`id`  int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT  '唯一编号，自增长'," +
            "PRIMARY KEY `id` (`id`)"+
            ") ENGINE=MyISAM  DEFAULT CHARSET=utf8  AUTO_INCREMENT= 1 ";
        console.log(createTable);
        sqlQuery(connect,createTable,function(err,results){
            var cols=sqlObj.alterCols.constructor.cols;
            for(var k in cols){
                isSetColName(connect,prefixTable+sqlObj.table,cols[k]);
            }
        });
    }
    /*
    * 检查是否存在字段
    * @connect 数据库链接对象
    * @table 数据表
    * @col 字段(obj)
    * */
    function isSetColName(connect,table,col){
        var sql2='desc `'+table+'` '+col.colName;
        sqlQuery(connect,sql2,function(err,results){
            if(results.length==0||results==undefined){
                addAlterCols(table,col.colName,col.type,col.index,col.title,connect);
            }
        });
    }
    /*
    * 添加字段
    * @table 表名
    * @colName 字段名
    * @type 类型
    * @index 索引
    * @title 字段说明commit
    * @connect 链接数据库对象
    * */
    function addAlterCols(table,colName,type,index,title,connect){
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
            sqlQuery(connect,sql);
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
            isTable=true;
        }
    }
    function isSetTable(connect,sqlObj){
        var sql='SHOW TABLES LIKE "'+prefixTable+sqlObj.table+'"';
        console.log(sql);
        sqlQuery(connect,sql,function(err,results){
            if(results.length==0||results==undefined){
                createTable(connect,sqlObj);
            }else{
                isTable=true;
            }
        });
    }
    /*
    * 判断上传图片扩展名
    * */
    function extOk(ext){
        var extArr=['jpg','jpeg','png','swf'];
        return extArr.indexOf(ext)<0?false:true;
    }
    /*
    * 判断文件上传的大小
    * */
    function sizeOk(size){
        return size<1024*1024*10?true:false;
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
            var sql= 'SELECT '+colsStr+' FROM '+prefixTable+sqlObj.table+' WHERE '+sqlObj.additions+groupStr+orderStr+limitStr+offsetStr;
            console.log(sql);
            var data=sqlQuery(connect,sql,function(err,results,fields){
                if(fn instanceof Function){
                    fn(results,fields,connect);
                }
                connect.end();
                return {err:err,results:results,fields:fields}
            });
            return data;
        },
        insert:function(connect,sqlObj,fn){
            var is=false;
            var t=setInterval(function(){
                isSetTable(connect,sqlObj);
                if(isTable){
                    clearInterval(t);
                    if(isTable){
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
                        var sql='INSERT INTO '+prefixTable+sqlObj.table+' ('+colsStr+') VALUES ('+valStr+')';
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
        },
        update:function(connect,sqlObj,fn){
            var limitStr=sqlObj.limit==(""||undefined)?"":' limit '+sqlObj.limit,
                orderStr=sqlObj.order==(""||undefined)?" ":' order by '+sqlObj.order,
                colsStr;
            if(util.isArray(sqlObj.cols)){
                for(var k in sqlObj.cols){
                    sqlObj.cols[k]=sqlObj.cols[k]+"=?"
                }
                colsStr=sqlObj.cols.join(",");
            }else{
                console.log("ERROR:cols必须为数组")
            }
            var sql= 'UPDATE '+prefixTable+sqlObj.table+' SET '+colsStr+' WHERE '+sqlObj.additions+orderStr+limitStr;
            console.log(sql);
            connect.query(
                sql,sqlObj.value,
                function(err, results) {
                    if (err) {
                        console.log('[UPDATE ERROR]-'+err.message);
                    }
                    if(fn instanceof Function){
                        fn(results,connect);
                    }
                    //connect.release()
                }
            );
        },
        delete:function(connect,sqlObj,fn){
            var sql= 'DELETE FROM '+prefixTable+sqlObj.table+' WHERE '+sqlObj.additions;
            sqlQuery(connect,sql,function(err,results){
                if(fn instanceof Function){
                    fn(results,connect);
                }
            });
        },
        /*
        * 上传文件
        * @fileName input的name
        * @ fileType 上传的文件的格式(bool),true为只能上传图片,反之,无限制
        * @ fn 执行文件操作后的回调函数,自带file的路径参数
        * */
        upload:function(req, res, next,fileName,fileType,fn){
            var file="";
            //生成multiparty对象，并配置上传目标路径
            var form = new multiparty.Form({uploadDir: './public/uploads/'});
            //上传完成后处理
            form.parse(req, function(err, fields, files) {
                var filesTmp = JSON.stringify(files,null,2);
                if(err){
                    console.log('parse error: ' + err);
                } else {
                    //console.log('parse files: ' + filesTmp);
                    var inputFile = files.inputFile[0];
                    var uploadedPath = inputFile.path;
                    var dstPath = './public/uploads/' + inputFile.originalFilename;
                    //重命名为真实文件名
                    fs.rename(uploadedPath, dstPath, function(err) {
                        if(err){
                            console.log('rename error: ' + err);
                        } else {
                            console.log('rename ok');
                        }
                    });
                }
                files[fileName].forEach(function(v,k){
                    var ext=v.originalFilename.substring(v.originalFilename.indexOf('.')+1);
                    //if(fileType&&!extOk(ext)){
                    //    console.log(2);
                    //    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
                    //    res.write('图片格式不正确!');
                    //    return;
                    //}
                    //if(!sizeOk(v.size)){
                    //    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
                    //    res.write('上传文件最大不能超过10M!');
                    //}
                    file+= v.path+","
                });
                if(fn instanceof Function){
                    fn(file);
                }
            });
            res.end();
        }

    }
}());
module.exports=core;
