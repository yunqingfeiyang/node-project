//聊天室  服务器端的文件
//cnpm i ws -S
const ws = require("ws"); //ws  webSocket缩写 模块需要安装
const webSocketServer = ws.Server;
const port = 3900;

//1.创建服务器 绑定ip + 端口  监听端口
const wss = new webSocketServer({port});//启动服务器端  socket 监听3900
console.log(`webSocket is running at ws://0.0.0.0:3900`);

let count = 0;
let info = "romantic_"
let clientUserMap = {};
//2.监听客户端的连接
//on emit 监听 发送
wss.on("connection",(socket)=>{
    //表示客户端连接成功
    //socket 来自客户端的连接对象
    console.log(`客户端socket上线了...`);
    //每个用户分配一个流水号
    count++;
    socket.name = info+count;
    clientUserMap[socket.name]=socket;//放置对象里面

    //3.监听客户端发送的消息
    socket.on("message",(msg)=>{
        console.log(msg);

        //4.把来自客户端的消息  转发给其他的在线客户端
        boradcast(socket,msg);
    });

    //5.监听 客户端的关闭
    socket.on("close",()=>{
        boradcast(socket,"886,我下线了...");
        //对象删除  delete obj[key]
        delete clientUserMap[socket.name];
    })
})


//将消息广播出去
function boradcast(socket,msg){
    for(var i in clientUserMap){
        var hour = new Date().getHours();
        var min = new Date().getMinutes();
        //谁说:msg
        clientUserMap[i].send(`${socket.name} 说: (${hour}:${min}) ${msg}`);//发送消息
    }
}