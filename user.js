
const Model=require('./schema/userSchema');
const UserModel=Model.getModels('userModel');
const Chats=Model.getModels('chats');

const express=require('express')
const Router =express.Router()   
const cookie=require('cookie-parser');
const sqlLimit={pwd:0,__v:0};

Router.get('/data',function(req,res){
    if(!req.cookies||!req.cookies.userid) {
        return res.send({status:301,msg:'请重新登陆'})
    }
    UserModel.findOne({_id:req.cookies.userid},sqlLimit,function(err,result){
        if(err){
            console.log(err);
        }else{
            res.send({status:200,data:result})
        }
    })
})
Router.get('/list',function(req,res){
    const {type}=req.query;
    UserModel.find({type:type},function(err,result){
        if(err){
            console.log(err)
        }else{
            return res.send({status:200,data:result})
        }
    })
})
Router.get('/getMsgList',function(req,res){
    const {userid}=req.cookies;
    UserModel.find({},function(err,userdoc){
        let users={}
        userdoc.forEach(v=>{
            users[v._id]={name:v.user,avator:v.avator}
        })
        Chats.find({'$or':[{from:userid},{to:userid}]},function(err,doc){
            if(!err){
                return res.send({status:200,data:doc,users:users})
            }else{
                return res.send({status:301,msg:"服务器错误"})
            }
        })
    })
    
})
Router.post('/msgRead',function(req,res){
    const userid=req.cookies.userid;
    const {from}=req.body;
    // console.log(userid,from)
    Chats.update({from:from,to:userid},{"$set":{Read:true}},{multi:true},function(err,doc){
        console.log(doc);
        if(!err){
            return res.send({status:200,num:doc.nModified})
        }else{
            return res.send({status:301,msg:"服务器错误"})
        }
    })
})

Router.get('/sendMsgList',function(req,res){
    
    Chats.find({},function(err,doc){
        if(!err){
            return res.send({status:200,data:doc})
        }else{
            return res.send({status:301,msg:"服务器错误"})
        }
    })
})


 

Router.post('/login',function(req,res){
    let user=req.body.user;
    let pwd=req.body.pwd;
    if(user&&pwd){
        UserModel.findOne({user:user},function(err,result){
            if(result){
                if(pwd===result.pwd){
                    res.cookie('userid',result._id);
                    return res.send({status:200,data:result,msg:"登陆成功"})
                }else{
                    return res.send({status:301,msg:"密码错误"})
                }
            }else{
                return res.send({status:301,msg:"账号不存在"})
            }
        })
    }else{
        return res.send({status:301,msg:"登陆填写不全"})
    }
})
Router.post('/update',function(req,res){
    if(!req.cookies.userid){
        return res.send({status:301,msg:'登陆信息过期'})
    }
    const userId=req.cookies.userid;
    const bodyData=req.body;
    UserModel.findByIdAndUpdate(userId,bodyData,function(err,result){
        if(err){
            console.log(err)
        }else{
            const data=Object.assign({},{
                user:result.user,
                type:result.type
            },bodyData)
            return res.send({status:200,data,msg:"操作成功"})
        }
    })
})

Router.post('/regist',function(req,res){
    let user=req.body.user;
    let pwd=req.body.pwd;
    let rePwd=req.body.rePwd;
    let type=req.body.type;
    if(user&&pwd&&rePwd&&type){
        UserModel.findOne({user:user},function(err,result){
            if(err){
                console.log(err)
            }else{
                if(result){
                    return res.send({status:301,msg:"用户名已被注册"})
                }else if(pwd!==rePwd){
                    return res.send({status:301,msg:"密码不一致"})
                }else{
                    const userMod=new UserModel(req.body)
                    userMod.save(function(err,result){
                        if(err){
                            console.log(err)
                        }else{
                            res.cookie('userid',result._id)
                            return res.send({status:200,msg:"注册成功"})
                        }
                    })
                    // UserModel.create();
                }
            }
        })
    }else{
        return res.send({status:301,msg:"信息填写不全"})
    }
   
})
module.exports=Router