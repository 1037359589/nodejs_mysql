/**
 * Created by bll on 16/5/4.
 */
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var formidable = require('formidable');
var core=require("../core");
router.get('/upload', function(req, res,next) {
    res.render('test/upload', { title: 'dasdasd' });
});
/* 上传*/
router.post('/file/uploading', function(req, res, next){
    //生成multiparty对象，并配置上传目标路径
    console.log(req.body);
    core.upload(req, res, next,'inputFile',true,function(filePath){
        console.log(filePath,123123);
    });
});
router.post('/uploading',function(req, res, next){
    console.log(req.body,'mmm');
    //req.on('data', function(chunk) {
    //    console.log("Received body data:");
    //    console.log(chunk);
    //});
    var form = new formidable.IncomingForm();
    form.uploadDir = "public/uploads/";
    form.name='index';
    form.keepExtensions = true;
    console.log(form);
    var  ffiles = {};
    form.on('file', function(name, file) {
        if (typeof ffiles[name] !== 'object' || ffiles[name] === null) {
            ffiles[name] = {};
        }
        ffiles[name][file.name] = file;
    });
    form.parse(req,function(err, fields, files){
        console.log(files.inputFile.name);
        var types = files.inputFile.name.split('.');
        var date  = new Date();

        var ms  = Date.parse(date);
        var extName = '';  //后缀名
        if (err) {
            res.locals.error = err;
            res.render('index', { title: TITLE });
            return;
        }
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
        if(extName.length == 0){
            res.locals.error = '只支持png和jpg格式图片';
            //res.render('index', { title: TITLE });
            return;
        }
        var avatarName =date + '.' + extName;
        var newPath = form.uploadDir + avatarName;
        fs.renameSync(files.inputFile.path, newPath);
    });
    //
    form.on('end', function() {
        res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        res.end('上传成功!!');
    });
    //生成multiparty对象，并配置上传目标路径
    console.log(req.body);
});

module.exports = router;