const express=require("express")
const mongoose=require("mongoose")
const taskModel=require("./taskmodel")

const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:false}))

let count=0;
app.listen(5000,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("server is running on 5000 port")
    }
})

mongoose.connect("mongodb://localhost/task2",()=>{
    console.log("connected to db")
},(err)=>{
    console.log(err)
})

app.post("/add",(req,res)=>{
    
    taskModel.find({title:req.body.title}).then((val)=>{
        if(!val.length){
            count++
            taskModel.create({
                id:count,
                title:req.body.title
            }).then((data)=>{
                res.status(201).send({id:data.id})
            }).catch((err)=>{
                res.status(400).send(err.message)
            })
        }else{
            res.status(400).send("Task is already present")
        }
    })
})

app.get("/tasks",(req,res)=>{
    taskModel.find().then((data)=>{
        res.status(200).send(data)
    }).catch((err)=>{
        res.status(400).send(err.message)
    })
})
app.get("/tasks/:id",(req,res)=>{
    taskModel.find({id:req.params.id}).then((data)=>{
        if(data.length){
            res.status(200).send(data[0])
        }else{
            res.status(404).send("There is no task at that id")
        }
    }).catch((err)=>{
        res.status(400).send(err.message)
    })
})

app.delete("/tasks/:id",(req,res)=>{
    taskModel.deleteOne({id:req.params.id}).then((data)=>{
        res.status(204).send("Task deleted sucessfully")
    }).catch((err)=>{
        res.status(204).send("Task deleted sucessfully")
    })
})

app.put("/tasks/:id",(req,res)=>{
    taskModel.find({id:req.params.id}).then((data)=>{
        if(data.length){
            taskModel.updateOne({id:req.params.id},{$set:{
                title:req.body.title,
                iscompleted:req.body.iscompleted
            }}).then(()=>{
                res.status(200).send("updated sucessfully")
            }).catch((err)=>{
                res.status(404).send("There is no task at that id")
            })
        }else{
            res.status(404).send("There is no task at that id")
        }
    })
})
let arr=[]
app.post("/tasks",(req,res)=>{
    let addTasks=req.body.tasks
    console.log(addTasks)
    
    let arr1=[]
    for(let i=0;i<addTasks.length;i++){
        taskModel.find({title:addTasks[i].title}).then((val)=>{
            if(!val.length){
                count++
                taskModel.create({
                    id:count,
                    title:addTasks[i].title,
                    iscompleted:addTasks[i].iscompleted
                }).then((data)=>{
                    console.log(data.id)
                    arr.push({id:data.id})
                    arr1=[...arr]
                    console.log(arr)
                }).catch((err)=>{
                    res.status(400)
                })
            }
        })
    }
    console.log(arr1)
    res.status(200).send({tasks:arr})
})

app.delete("/tasks",(req,res)=>{
    let dTasks=req.body.tasks
    // console.log(dTasks)
    for(let i=0;i<dTasks.length;i++){
        taskModel.deleteOne({id:dTasks[i].id}).then(()=>{
            res.status(200)
        }).catch((err)=>{
            res.status(400)
        })
    }
    res.status(200).send("All the task deleted sucessfully")
})
