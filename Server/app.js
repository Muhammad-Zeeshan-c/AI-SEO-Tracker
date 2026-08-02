import express from "express";
import cors from 'cors'
import connectDB from './config/db.js'
import 'dotenv/config'

import authRouter from './Routes/authRoutes.js'
import rankRouter from './Routes/rankRoutes.js'
import analysisRouter from './Routes/analysisRoutes.js'

const app=express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://thesearchscope.vercel.app',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json())



// Database connection
connectDB();

//Routes
app.get('/',(req,res)=>{
    res.send('Server is running')
})
app.use('/api/auth',authRouter)
app.use('/api/rank',rankRouter)
app.use('/api/analysis',analysisRouter)

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}

export default app;