/**
 * Created by bll on 16/4/20.
 */
var accounts={
    constructor:{
        cols:[
            {
                colName:'username',
                type:50,
                index:"u",
                title:"用户名"
            },
            {
                colName:"phone",
                type:11,
                index:"i",
                title:"手机号码"
            },
            {
                colName:"sex",
                type:10
            },
            {
                colName:"age",
                type:'tinyint'
            }

        ]
    }
};
module.exports = accounts;


