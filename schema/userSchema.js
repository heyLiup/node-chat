const Mongoose=require('mongoose');
const Schema=Mongoose.Schema;

const models={
    userModel:{
        user:{type:String,require:true},
        pwd:{type:String,require:true},
        type:{type:String,require:true},
        title:{type:String},
        money:{type:String},
        desc:{type:String},
        company:{type:String}, 
        avator:{type:Object}
    },
    chats:{
        chatId:{type:String,require:true},
        from:{type:String,require:true},
        to:{type:String,require:true},
        content:{type:String,default:"",require:true},
        create_time:{type:String,default:new Date().getTime()},
        Read:{type:Boolean,default:false,require:true}
    }
}
    
for(var i in models){
    Mongoose.model(i,new Schema(models[i]))
}

module.exports={
    getModels(name){
        return Mongoose.model(name);
    }
}
