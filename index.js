import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js";
import Task from "./models/task.js";


dotenv.config();

const app=express(); 

app.use(cors())

app.use(express.json())

app.get("/tasks",async(req,res)=>{ 
    try {
        const tasks=await Task.find({});
        res.status(200).json({success:true, data:tasks})
    } catch (error) {
        console.log(error)
    }
})

app.post("/tasks",async(req,res)=>{
    const task=req.body;

    if(!task.name||!task.description){
        return res.status(400).json({success:false, message:"Please provide all fields"})
    }

    const newTask=new Task(task);

    try {
        await newTask.save();
        res.status(200).json({success:true,data:newTask});
    } catch (error) {
        console.log("error in creating the product",error);
        res.status(500).json({success:false, message:"server error"});
    }
})

app.delete("/tasks/:id",async(req,res)=>{
    const {id}=req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.status(200).json({success:true, message:"task deleted"})
    } catch (error) {
        console.error(error)
    }
})


app.listen(5000,()=>{
    connectDB();
    console.log("server started at http://localhost:5000")
})