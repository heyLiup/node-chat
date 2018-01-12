const mongoose=require('mongoose');
const BASE_URL='mongodb://localhost:27017/imooc'

mongoose.connect(BASE_URL)
mongoose.connection.on('connected',function(err){
    if(!err){
        console.log('mongoose is connect')
    }else{
        console.log(err);
    }
})