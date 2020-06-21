var express = require('express');
var router = express.Router();//express内置Router模块

var {
  Mv,
  User
} = require("../utils/model")

var {
  checkSession
} = require("../utils");

//路由文件  写了哪些接口
//express路由机制
//根据 路由路径加载 对应路由数据


/* GET home page. */
//router 路由模块 实现动态路由数据交互(页面  json字符串)
//get  get请求
//  /路由 路径(req.url)
//req 请求信息
//res 响应数据(res.render   res.send    res.json   res.redirect)
//next 进入下一个中间件

router.get('/', function(req, res, next) {
  res.render('./index.ejs',
   { title: 'Express' ,
     msg:"NZ1903 - 拼搏到感动自己",
     flag:!!1,
     username:"佩佩",
     oh:"<h2>hello - world</h2>",
     course:["Node","Vue","React","Angular"]  
  });
});

router.get("/home",(req,res)=>{  //路由路径  地址栏
  res.render("home",{           //渲染的页面 文件
    username:req.session.username
  })
})

router.get("/login",(req,res)=>{
  var username = req.query.username || "";  //注册成功
  res.render("login",{username:username})
})

//显示ejs文件  必须配置路由 执行 render 渲染
router.get("/register",(req,res)=>{
  res.render("register.ejs")
})

router.get("/my",(req,res)=>{
  if(req.session.username){ //已经登录
    User.findOne({
      username:req.session.username
    }).then(result=>{
      console.log(result);
      res.render("my",{result});//对象 key-value 相同直接合并简写
    })
  }else{
    res.send(`<script>alert("你的登录已经失效，请重新登录");location.href='/login'</script>`)
  } 
})

router.get("/nz1903",(req,res)=>{
  res.send("NZ1903 - 奋起") //res.send 响应字符串
})

router.get("/logout",(req,res)=>{
  //销毁 req.session
  req.session.destroy(()=>{
    res.redirect("/home");
  })
})

router.get("/movie",(req,res)=>{
  //自动判断是否登录
  const query = req.query;//前端发送过来的参数
  console.log(query);
  var searchObj = {}; //搜索条件
  var sortObj = {};  //排序条件
  if(query['keyword']){  //搜索
    var keyword = query['keyword'];
    searchObj = {
      $or:[  //或查询
        {title : new RegExp(keyword)},
        {year : new RegExp(keyword)},
        {genres : new RegExp(keyword)},
      ]
    }
  }else{  //排序条件  ?year=1
    sortObj = query;
  }
  checkSession(req,res,()=>{
    Mv.find(searchObj,{_id:0})
    .sort(sortObj)
    .then(result=>{
      res.render("movie",{result});
    })
  })
})

router.get("/resetpwd",(req,res)=>{
  if(req.session.username){
    res.render("resetpwd");
  }else{
    res.send(`<script>alert("你的登录已经失效，请重新登录");location.href='/login'</script>`)
  }
})

router.get("/webSocket",(req,res)=>{
  checkSession(req,res,()=>{
    res.render("webSocket")
  })
})

module.exports = router;
