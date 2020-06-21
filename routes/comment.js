//路由  评论  模块
var express = require("express");
var router = express.Router();
var {
    checkSession,
    dateFormat
} = require("../utils");

var {
    Mv,
    Uid,
    Comment
} = require("../utils/model");

//测试
router.get("/",(req,res)=>{
    
    res.send("this is my movie comment router module");
})

//显示 电影评论页面
router.get("/index",(req,res)=>{
    var {
        mid
    } = req.query;//根据mid去查询当前这条电影的数据信息
    checkSession(req,res,()=>{  //c 登录成功进行的操作
        Mv.findOne({
            id:mid
        }).then(result=>{
            console.log(result);
            res.render("comment.ejs",{result});
        })
    })
})

//插入数据库 提交评论
// router.post("/submit",(req,res)=>{
//     var body = req.body;
//     console.log(body);
//     var {
//         mid
//     } = req.query;
//     checkSession(req,res,()=>{  //先登录
// //         //查询电影详情
// //         //获取自增长的Id  查询再加1  findOne+update
// //         //擦入
//         Mv.findOne({  //查询出需要评论的电影的数据
//             id:mid
//         }).then(movie=>{  //电影数据
//             Uid.updateMany({  //uids id+1
//                 name:"comments",
//             },{
//                 $inc:{
//                     id:1
//                 }
//             },{
//                 new:true  //返回更新之后的数据
//             }).then(data=>{
//                 Uid.findOne({
//                     name:"comments"
//                 }).then(obj=>{
//                     console.log(obj);//自增长的id
//                     //因为mongodb不能实现表连接查询
//                     //插入操作
//                     body.time = dateFormat();
//                     body.id = obj.id;
//                     body.username = req.session.username;
//                     body.mid = movie.id;
//                     body.mtitle = movie.title;
//                     body.mpic = movie.images.large;//电影图片
//                     //评论插入
//                     Comment.insertMany(body)
//                     .then(result=>{
//                         //显示评论列表
//                         res.session.mid = mid;//记录 评论的电影的id
//                         //res.send("评论成功")
//                         //重定向到电影列表
//                         res.redirect("/comment/mlist")
//                     })

//                 })
//             })
//         })
//     })
// })
router.post("/submit",(req,res)=>{
    var body = req.body;
    console.log(body);
    var {
        mid
    } = req.query;
    checkSession(req,res,()=>{
        // 1. 查询电影详情 
        // 2. 获取自增长 的 id   查询再加1  findOne+update 
        // 3. 插入  
        // res.send("评论提交成功..."); 
        Mv.findOne({   // 查询出需要评论的电影的数据
            id:mid
        }).then(movie=>{  // 电影数据 
            // 作业 (vue 回来尝试 现在写 会绕晕 )

            // API已经被废弃 
            Uid.findOneAndUpdate({
                name:"comments",
            },{
                $inc:{
                    id:1
                }
            },{
                new:true   //  返回更新之后的数据 
            }).then(obj=>{
                console.log(obj);  // 返回更新之前的数据 
                body.time = dateFormat();
                body.id = obj.id; 
                body.username = req.session.username;
                body.mid = movie.id;
                body.mtitle = movie.title;
                body.mpic = movie.images.large; // 电影图片 
                // 评论插入  
                Comment.insertMany(body)
                .then(result=>{
                    //  显示评论列表 
                    req.session.mid = mid;  // 记录一下 你评论的电影id 
                    // res.send("评论成功...")
                    // 重定向到 电影评论列表 
                    res.redirect("/comment/mlist")
                })
            })
        })
    })
})



// 评论列表
// 分页  limit skip 
// router.get("/mlist",(req,res)=>{
//     checkSession(req,res,()=>{
//         // 查询所有的电影评论 
//         // 当前页码 pageNo  默认为 1 
//         // 总条数  total 
//         // 每页显示的数据  pageSize  ( 4  8  10 15);
//         // 总页数  totalPage 
//         var query = req.query;
//         var pageNo = query.pageNo * 1 || 1; 
//         var total = 0;
//         var pageSize = query.pageSize * 1 || 4;
//         var totalPage = 0;
//         // 总条数  /  pageSize =  总页码 

//         Comment.find()
//         .then(result=>{
//             if(result.length>0){
//                 total = result.length;
//                 totalPage = Math.ceil(total/pageSize);  // 向上取整数 
//                 pageNo = pageNo<=1?1:pageNo; // 过滤小于 1  
//                 pageNo = pageNo >= totalPage ? totalPage:pageNo // 过滤大于 总页码 
//             }
//             Comment.find()
//             .sort({_id:-1})  // 排序
//             .skip((pageNo-1)*pageSize)     // 跳过  前几页数据 
//             .limit(pageSize)    // 限制 pageSize 
//             .then(data=>{
//                 res.render("mlist",{
//                     result:data,
//                     username:req.session.username,
//                     total,
//                     pageSize,
//                     totalPage,
//                     pageNo
//                 })
//             })
//         })

//         // Comment.find({},{}).sort({_id:-1})
//         // .then(result=>{
//         //     res.render("mlist.ejs",{
//         //         result,
//         //         username:req.session.username
//         //     });
//         // })
        
//     })
// })
router.get("/mlist",(req,res)=>{
    checkSession(req,res,()=>{
        // 查询所有的电影评论 
        // 当前页码 pageNo  默认为 1 
        // 总条数  total 
        // 每页显示的数据  pageSize  ( 4  8  10 15);
        // 总页数  totalPage 
        var query = req.query;
        var pageNo = query.pageNo * 1 || 1; 
        var total = 0;
        var pageSize = query.pageSize * 1 || 4;
        var totalPage = 0;
        // 总条数  /  pageSize =  总页码 

        Comment.find()
        .then(result=>{
            if(result.length>0){
                total = result.length;
                totalPage = Math.ceil(total/pageSize);  // 向上取整数 
                pageNo = pageNo<=1?1:pageNo; // 过滤小于 1  
                pageNo = pageNo >= totalPage ? totalPage:pageNo // 过滤大于 总页码 
            }
            Comment.find()
            .sort({_id:-1})  // 排序
            .skip((pageNo-1)*pageSize)     // 跳过  前几页数据 
            .limit(pageSize)    // 限制 pageSize 
            .then(data=>{
                res.render("mlist",{
                    result:data,
                    username:req.session.username,
                    total,
                    pageSize,
                    totalPage,
                    pageNo
                })
            })
        })

        // Comment.find({},{}).sort({_id:-1})
        // .then(result=>{
        //     res.render("mlist.ejs",{
        //         result,
        //         username:req.session.username
        //     });
        // })
        
    })
})


// 删除评论
router.get("/delete",(req,res)=>{
    const {
        _id
    } = req.query;
    console.log(_id);
    checkSession(req,res,()=>{
        // 删除 deleteMany  满足条件只有一个 删除一个  
        Comment.deleteMany({
            _id:_id
        }).then(result=>{
            res.json({
                code:200,
                msg:"评论删除成功",
                type:1,
                result
            })
        })
    })
})

// 修改评论 post
router.post("/update",(req,res)=>{
    const body = req.body;
    console.log(body);
    // 修改操作
    Comment.updateMany({
        id:body.id
    },{
        $set:{
            title:body.title,
            content:body.content
        }
    }).then(result=>{
        res.json({
            msg:"修改评论成功",
            code:200,
            type:1,
            result
        })
    })
    
})

module.exports = router;