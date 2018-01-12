// import express from 'express';
const express=require('express');
const mongoose=require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const path=require('path');
const UserRouter=require('./user')

require('./model')

const Model=require('./schema/userSchema');
const Chats=Model.getModels('chats');
// 添加 body-parser 中间件就可以了
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req,res,next){// 中间件拦截
    if(req.url.startsWith('/user/')||req.url.startsWith('/static/')){
        return next()
    }
    else{
        return res.sendFile(path.resolve('build/index.html'))
    }
})

app.use(cookieParser())
app.use('/',express.static(path.resolve('build')))
app.use('/user',UserRouter)

io.on('connection',function(socket){
    socket.on('sendMessage',function(data){
        console.log(data);
        const {from,to,msg}=data;
        Chats.create({from,to,content:msg,chatId:[from,to].sort().join('_')},function(err,doc){
            // console.log(doc._doc);  //本次插入的数据
            io.emit('resvMsg',Object.assign({},doc._doc))
        });
    })
})

server.listen(8080,function(err){
    console.log('8080 is start')
})