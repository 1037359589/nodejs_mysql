/**
 * Created by bll on 16/4/18.
 */
var mysql=require('mysql');
var connection=mysql.createConnection(({
    host:'127.0.0.1',
    user:'root',
    password : '919927',
    port: '3306',
    database: 'test'
}));
var TEST_TABLE='yun_account';
function getData(){
    connection.query(
        'SELECT * FROM '+TEST_TABLE,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }

            //if(results)
            //{
            //    for(var i = 0; i < results.length; i++)
            //    {
            //        console.log("%d\t%s\t%s", results[i].id, results[i].username, results[i].phone);
            //    }
            //}
            //console.log(results);
            data=results;

            connection.end();
        }
    );
    console.log(data);
    return data;
}
var data=getData();
module.exports = data;