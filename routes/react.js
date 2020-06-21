var express = require("express");
var router = express.Router();

const {
    LiuYan,
    User,
    Tw,
    Advise
} = require("../utils/model")

const {
    createToken
} = require("../utils/token")

router.get("/index",(req,res)=>{
    res.json({
        code:200,
        msg:"测试 react api 接口是否成功",
        result:null
    })
});

// 查询留言
router.get("/getComments",(req,res)=>{
    LiuYan.find({},{}).then(result=>{
        res.json({
            msg:'获取留言成功',
            code:200,
            result
        })
    })
})
// 添加留言
router.post("/addComment",(req,res)=>{
    var body = req.body;
    console.log(body);
    LiuYan.insertMany(body).then(data=>{
        LiuYan.find({},{}).then(result=>{
            res.json({
                msg:'评论添加成功',
                code:200,
                result,
                type:1,
            })
        })
    }).catch(err=>{
        res.json({
            code:200,
            msg:"评论插入失败..",
            err,
            type:0
        })
    })
})
// 删除留言
router.post("/delComment",(req,res)=>{
    var {
        delId 
    } = req.body;
    LiuYan.deleteMany({
        _id:delId
    }).then(result=>{
        res.json({
            code:200,
            msg:"评论删除成功..",
            result,
            type:1
        })
    }).catch(err=>{
        res.json({
            code:500,
            msg:"服务器异常",
            err,
            type:0
        })
    })
})
// 修改留言 updateMany  项目



// 注册
// 普通用户    
// 管理员用户  (数据库)
router.post("/register",(req,res)=>{
    var body = req.body;
    User.findOne({
        mobile:body.mobile
    }).then(data=>{
        if(data){
            res.json({
                code:200,
                msg:"注册失败,手机号码已经被注册",
                result:null,
                type:0
            })
        }else{
            body.time = new Date();
            body.type = 0;  // 默认普通用户 
            User.insertMany(body).then(result=>{
                res.json({
                    code:200,
                    msg:"注册成功,立马登录",
                    result:result,
                    type:1
                })
            })
        }
    })
})

router.post("/login",(req,res)=>{
    var body = req.body;
    console.log(body);
    User.findOne({
        mobile:body.mobile,
        // type:body.type
    }).then(result=>{
        console.log(result);
        if(result){
            if(result.password == body.password){
                // result.type = body.type;
                // 普通用户   type = 0  false 
                // 管理员用户  type = 1   true  
                const token = createToken(result.mobile);
                if(result.type==body.type){
                    res.json({
                        msg:"登录成功",
                        code:200,
                        type:1,
                        result,
                        token   //  token 一定发送客户端 
                    })
                }else{
                    res.json({
                        msg:"没有权限",
                        code:200,
                        type:0,  // 登录失败
                        result,
                    })
                }
            }else{
                res.json({
                    msg:"登录失败,密码或者手机号不正确",
                    code:200,
                    type:0,
                    result
                })
            }
        }else{
            res.json({
                msg:"登录失败,手机号没有被注册",
                code:200,
                type:0,
                result
            })
        }
        
    })
})


// 提交每日居民体温 

router.post("/wendusubmit",(req,res)=>{
    var body = req.body;
    body.time = new Date();
    body.toggle = body.wendu > 37.4;
    Tw.insertMany(body).then(result=>{
        res.json({
            msg:"每日体温登记成功",
            code:200,
            result
        })
    })
})

// 查询当前居民的体温记录
router.post("/wendu/list",(req,res)=>{
    var body = req.body;
    Tw.find({
        mobile:body.mobile
    }).sort({
        _id:-1   // 降序
    }).then(result=>{
        res.json({
            msg:"获取当前体温记录成功",
            code:200,
            result
        })
    })
})

// 删除体温记录  参数 delId
router.post("/deltwlog",(req,res)=>{
    var {
        delId 
    } = req.body;
    Tw.deleteMany({
        _id:delId
    }).then(result=>{
        res.json({
            code:200,
            msg:"删除成功..",
            result,
            type:1
        })
    }).catch(err=>{
        res.json({
            code:500,
            msg:"服务器异常",
            err,
            type:0
        })
    })
});

// 修改当前体温记录 
router.post("/tiwen/update",(req,res)=>{
    var {
        uid,
        wendu 
    } =req.body;
    Tw.updateMany({
        _id:uid
    },{
        $set:{
            wendu,
            toggle:wendu>37.4
        }
    }).then(result=>{
        res.json({
            code:200,
            msg:"修改成功",
            result,
            type:1
        })
    })
})


// 管理员新增用户  
router.post("/adduser",(req,res)=>{
    var body = req.body;
    User.findOne({
        mobile:body.mobile
    }).then(data=>{
        if(data){
            res.json({
                code:200,
                msg:"居民用户添加失败,手机已经存在",
                result:null,
                type:0
            })
        }else{
            body.time = new Date();
            body.type = 0;   // 默认就是普通用户 
            User.insertMany(body).then(data=>{
                User.find({type:0}).sort({_id:-1})
                .then(result=>{
                    res.json({
                        code:200,
                        msg:"居民用户添加成功",
                        result:result,
                        type:1
                    })
                })
            })
        }
    })
})

// 查询
router.post("/getusers",(req,res)=>{
    var body = req.body;
    // type:0 查询出普通居民用户 
    User.find({type:0}).sort({_id:-1})
        .then(result=>{
            res.json({
                code:200,
                msg:"获取居民信息成功",
                result:result,
                type:1
            })
        })
})

// 删除
// 参数 delId
router.post("/deluser",(req,res)=>{
    var {
        delId 
    } = req.body;
    User.deleteMany({
        _id:delId
    }).then(result=>{
        res.json({
            code:200,
            msg:"居民用户删除成功..",
            result,
            type:1
        })
    }).catch(err=>{
        res.json({
            code:500,
            msg:"服务器异常",
            err,
            type:0
        })
    })
});


// 修改 isTest
router.post("/updateusertest",(req,res)=>{
    var {
        uid,    // 修改的用户Id 
        isTest  // 是否核酸检测 
    } =req.body;
    User.updateMany({
        _id:uid
    },{
        $set:{
            isTest
        }
    }).then(result=>{
        res.json({
            code:200,
            msg:"核酸检测修改成功",
            result,
            type:1
        })
    })
})

// 修改用户信息 
router.post("/updateuser",(req,res)=>{
    var {
        uid,
        value
    }  =req.body;
    User.updateMany({
        _id:uid
    },{
        $set:value
    }).then(result=>{
        res.json({
            code:200,
            msg:"居民信息修改成功",
            result,
            type:1
        })
    })
})


// 查询建议  
router.post("/getalladvise",(req,res)=>{
    var body = req.body;
    // type:0 查询出普通居民用户 
    // var obj = {}
    // if(body.author){
    //     obj.author = body.author
    // }
    Advise.find(body).sort({_id:-1})
        .then(result=>{
            res.json({
                code:200,
                msg:"获取意见成功",
                result:result,
                type:1
            })
        })
})

// 插入 advise 
router.post("/addadvise",(req,res)=>{
    var body = req.body;
    body.time = new Date();
    Advise.insertMany(body).then(result=>{
        res.json({
            code:200,
            msg:"意见添加成功",
            result:result,
            type:1
        })
    })
})

//  删除 advise 
router.post("/deladvise",(req,res)=>{
    var {
        delId 
    } = req.body;
    Advise.deleteMany({
        _id:delId
    }).then(result=>{
        res.json({
            code:200,
            msg:"意见删除成功..",
            result,
            type:1
        })
    }).catch(err=>{
        res.json({
            code:500,
            msg:"服务器异常",
            err,
            type:0
        })
    })
});

router.post("/getadvisebyid",(req,res)=>{
    var body = req.body;
    Advise.findOne({
        _id:body._id
    }).then(result=>{
        res.json({
            code:200,
            msg:"获取成功",
            result:result,
            type:1
        })
    })
})


// 修改建议  
router.post("/updatadvise",(req,res)=>{
    var {
        uid,
        value
    }  =req.body;
    Advise.updateMany({
        _id:uid
    },{
        $set:value
    }).then(result=>{
        res.json({
            code:200,
            msg:"意见信息修改成功",
            result,
            type:1
        })
    })
})
module.exports = router;