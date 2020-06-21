//node连接mongodb数据库
//工具mongoose

const mongoose = require("mongoose");
const hostname = "47.105.140.36";
const port = 27017;
const dbname = "nz1903"
const user = "?"
const password = "?"

const conn_db_url = `mongodb://${hostname}:${port}/${dbname}`;//

mongoose.connect(conn_db_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},(err)=>{
    if(err){
        console.log("mongodb-数据库连接失败")
        throw err;
    }else{
        console.log("mongodn-数据库连接success")
    }
})
//开始连接数据库

//监听数据库的连接状态
const connection = mongoose.connection;
//连接成功
connection.on("connected",()=>{
    console.log("mongoose连接成功")
});
//连接异常
connection.on("error",(err)=>{
    console.log("Mongoose connection error" + err);
})
//连接断开
connection.on("disconnected",()=>{
    console.log("Mongoose connection 断开")
});

module.exports = connection;