/**
 * Created by bll on 16/5/4.
 */
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var uuid = require('node-uuid');
var formidable = require('formidable');
var core=require("../core");
router.get('/upload', function(req, res,next) {
    res.render('test/upload', { title: 'dasdasd',root:"localhost:3000/" });
});
/* 上传*/
//router.post('/file/uploading', function(req, res, next){
//    //生成multiparty对象，并配置上传目标路径
//    //console.log(req.body);
//    core.upload(req, res, next,'inputFile',true,function(filePath){
//        console.log(filePath,123123);
//    });
//});
router.post('/uploading',function(req, res, next){
    var newPath;
    var form = new formidable.IncomingForm();
    form.uploadDir = "public/uploads/";
    form.name='index';
    form.keepExtensions = true;
    form.maxFieldsSize = 5 * 1024 * 1024; //5M
    form.parse(req,function(err, fields, files){
        console.log(files.inputFile.name);
        var types = files.inputFile.name.split('.');
        var date  = new Date();

        var ms  = Date.parse(date);
        var extName = '';  //后缀名
        //if (err) {
        //    res.locals.error = err;
        //    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        //    res.end(res.locals.error);
        //    return;
        //}
        switch (files.inputFile.type) {
            case 'image/jpg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        //if(extName.length == 0){
        //    res.locals.error = '只支持png和jpg格式图片';
        //    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        //    res.end(res.locals.error);
        //    return;
        //}
        var avatarName =uuid.v1() + '.' + extName;
        newPath = form.uploadDir + avatarName;
        fs.renameSync(files.inputFile.path, newPath)
    });
    form.on('end', function() {
        console.log(newPath ,12312311231232312);
        //res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        res.send({status:'1',msg:"上传成功",filePath:newPath});
        //res.status(200).end(newPath);
    });

    //生成multiparty对象，并配置上传目标路径
    console.log(req.body);
});

module.exports = router;