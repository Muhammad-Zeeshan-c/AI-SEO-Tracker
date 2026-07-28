import express from "express";
import cors from 'cors'
import connectDB from './config/db.js'
import 'dotenv/config'

import authRouter from './Routes/authRoutes.js'

const app=express()

app.use(cors())
app.use(express.json())



//Routes
app.get('/',(req,res)=>{
    res.send('Server is running')
})

app.use('/api/auth',authRouter)

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
    connectDB()
})