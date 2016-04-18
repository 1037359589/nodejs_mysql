/**
 * Created by bll on 16/4/18.
 */
var http=require('http');
var url=require('url');
var PATHNAME;
function start(){
    function onRequest(req,res){
        console.log(req,res);
        var path=url.parse(req.url).pathname;
    }
    http.createServer(onRequest).listen(8888);
}
start();
exports.start = PATHNAME;