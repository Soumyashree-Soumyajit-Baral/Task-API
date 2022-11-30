const mongoose=require("mongoose")

const taskInfo=new mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    iscompleted:{
        type:Boolean,
        required:true,
        default:false
    }
})

const task=mongoose.model("tasks",taskInfo)
module.exports=task