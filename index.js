import dotenv from 'dotenv'
import express, { json } from 'express'
import {  connectionDB } from './DB/DBConnection.js'
import userRouter from './src/modules/users/users.routes.js'
import messageRouter from './src/modules/messages/messages.routes.js'
import cors from "cors"

const app = express()
const port = process.env.PORT || 3090;

dotenv.config()
connectionDB()
app.use(cors());
app.use(json())
app.use("/users",userRouter)
app.use("/messages",messageRouter)


app.use((err,req,res,next)=>{
    if(err){
        const statusCode = err.cause || 500; // Default to 500 if "cause" is not present or undefined
        const message = err.message || "Internal Server Error"; // Default message for the error
    
        return res.status(statusCode).json({ error: message });    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))