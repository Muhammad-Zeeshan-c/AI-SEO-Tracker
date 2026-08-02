import express from "express";
import cors from 'cors'
import connectDB from './config/db.js'
import 'dotenv/config'

import authRouter from './Routes/authRoutes.js'
import rankRouter from './Routes/rankRoutes.js'
import analysisRouter from './Routes/analysisRoutes.js'

const app=express()

app.use(cors())
app.use(express.json())



//Routes
app.get('/',(req,res)=>{
    res.send('Server is running')
})
app.use('/api/auth',authRouter)
app.use('/api/rank',rankRouter)
app.use('/api/analysis',analysisRouter)

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
    connectDB()
})