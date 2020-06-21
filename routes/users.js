var express = require('express');
var router = express.Router();

var {
  User
} = require("../utils/model")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//users/register
router.post("/register",(req,res)=>{
  var body = req.body;
  User.findOne({
    username:body.username,
  }).then(result=>{
    console.log(result);//null
    if(result){
      res.send(`<script>alert("用户名已经被注册，请重新注册");location.href="/register"</script>`)
    }else{
      body.time = new Date();//记录插入的时间
      User.insertMany(body)
      .then(data=>{
        res.send(`<script>alert("注册成功，立即跳转登录");location.href="/login?username=${body.username}"</script>`)
      })
      .catch(err=>{ //捕捉失败
        res.send(`<script>alert("服务器异常");location.href="/register"</script>`)

      })
    }
  })
})



// //注册  思路  先要配路由  router
// router.post("/register",(req,res)=>{
//   var body = req.body;
//   console.log(body);
// })
// //进行数据库的curd 增删改查
// // User.insertMany(body).then(result=>{
// //   console.log(result);
// //   res.send("注册成功")
// // })
// //1.先判断是否已经被注册
// //2.已经被注册就直接返回
// //3.没有被注册，就立即注册

// User.findOne({
//   username:body.username,
// }).then(result=>{
//   console.log(result);
//   if(result){
//     res.send(`<script>alert("用户名已经存在，请重新注册");location.href='/register' </script>`)
//   }else{
//     body.time = new Date();
//     User.insertMany(body)
//     .then(data=>{
//       res.send(`<script>alert("注册成功，马上跳转登录";location.href='/login?username=${body.usernamae}' </script>`)
//     })
//     .catch(err=>{ //catch是失败的回调
//       res.send(`<script>alert("注册失败，数据库错误");location.href='/register'</script>`)
//     })
//   }
// })

// //登录  思路 先要路由  router
// router.post("/login",(req,res)=>{
//   var body = req.body;
//   console.log(body);

//   //User登录  
//   User.findOne({
//     username:body.username
//   }).then(result=>{
//     if(result){
//       if(result.password===body.password){
//         //记住登录状态 username 保存下来(session cookies)
//         //sesssion 记录用户从登录到退出的登录或者关闭网页 这段事件内保存的所有数据
//         //登录成功直接体跳转首页home
//         //res.send("登录成功")

//         req.session.username = body.username;
//         console.log(req.session);
//         res.redirect("/home"); //redirect重定向
//       }else{
//         res.send(`<script>alert("用户名或者密码不正确，请重新登录");location.href="/login"</script>`)
//       }
//     }else{
//       res.send(`<script>alert("用户名不对，请重新登录");location.href="/login"</script>`)
//     }
//   })
// })



// router.get("/demo",(req,res)=>{
//   console.log(req.url);
//   res.send("demo - demo - demo");
// });

// router.get("/list",(req,res)=>{
//     // req.query 获取 query 对象数据  
//     res.json({
//       msg:"返回是 JSON 数据",
//       code:200,
//       query:req.query  // 查询参数  ?
//     })
// })

// router.get("/some",(req,res)=>{
//   res.json({
//     msg:"some-some-some",
//     code:"3000",
//     headers:req.headers  // 获取请求头 
//   })
// })

// // all   get && post
// router.all("/all",(req,res)=>{
//   res.send("这是 get && post 都可以调用的 请求 ")
// })

// // 只要浏览器能直接打开  都是get  请求 POST 无法在浏览器打开的 
// // 登录 POST  
// router.post("/userLogin",(req,res)=>{
//     res.json({
//       msg:"这是一个POST 请求 -- userLogin ",
//       body:req.body   // formData 数据 
//     })
// })




//登录操作
router.post("/login",(req,res)=>{

  console.log(1111111111111)
  var body = req.body;
  //登录必须用户名和密码匹配成功
  User.findOne({
    username:body.username,
    password:body.password
  }).then(result=>{
    if(result){
      //跳转首页
      //把用户名存储到req.session
      req.session.username = result.username;
      res.redirect("/home");
      //res.send(`<script>alert()</script>`)
    }else{
      res.send(`<script>alert("用户名或密码错误，请重新登录");location.href="/login"</script>`)
    }
  })
})


//修改个人信息
router.post("/changeinfo",(req,res)=>{
  var body = req.body;
  console.log(body);
  if(req.session.username){
    User.updateMany({
      username:req.session.username
    },{
      $set:body
    }).then(result=>{
      res.json({
        msg:"个人信息修改成功",
        result,
        code:200
      });
    })
  }else{
    res.send(`<script>alert("用户名或者密码错误，请重新登录");location.href="/login"</script>`)
  }
})


//重置密码
router.post("/resetpwd",(req,res)=>{
  const {
    oldpassword,
    newpassword
  } = req.body;
  console.log(oldpassword,newpassword);//前端发送到服务器的参数

  if(req.session.username){
    //表示已经登录
    User.findOne({
      username:req.session.username
    }).then(data=>{
      if(data.password === oldpassword){ //判断是否与原密码一致
        User.updateMany({
          username:req.session.username
        },{
          $set:{
            passeord:newpassword
          }
        }).then(result=>{
          //res.send("密码重置成功")
          //res.json()
          //res.render()  ajax绝对不能使用  渲染ejs文件
          res.json({
            code:200,
            msg:"密码重置成功",
            type:1
          })
        })
      }else{
        res.json({
          code:200,
          msg:"原始密码输入错误，重置密码失败",
          type:0
        })
      }
    })
  }else{
    res.send(`<scirpt>alert("你的登录已经失败，请重新登录");location.href='/login'</script>`)
  }
})

module.exports = router;
