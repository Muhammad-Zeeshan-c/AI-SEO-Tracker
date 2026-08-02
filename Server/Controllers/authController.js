import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//Function to generate JWT token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn:'7d'
    })
}


//Function to register user
export const registerUser = async (req,res,next)=>{
    try{
        const {name,email,password}=req.body

        
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required",success:false})
        }

        const userExsists=await User.findOne({email:email})

        if(userExsists){
            return res.status(400).json({message:"User already exists",success:false})
        }

        //Hashing password
        const hashedPassword=await bcrypt.hash(password,12)
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })

        const jwtToken=generateToken(user._id)

        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            jwtToken,
            user
        })
    }
    catch(err){
        console.error(err)

        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}


//Function to login user

export const loginUser = async (req,res,next)=>{
    try{
        const {email,password}=req.body

        if(!email || !password){
            return res.status(400).json({message:"All fields are required",success:false})
        }

        const user=await User.findOne({email:email})

        if(!user){
            return res.status(400).json({message:"Wrong password or email",success:false})
        }


        const isMatched=await bcrypt.compare(password,user.password)

        if(!isMatched){
            return res.status(400).json({message:"Wrong password or email",success:false})
        }



        const jwtToken=generateToken(user._id)


        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            jwtToken,
            user
        })
    }
    catch(err){
        console.error(err)

        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}


//Get current User


export const getCurrentUser = async (req,res,next)=>{
    try{
        const user=await User.findById(req.userid).select('-password')

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"User found",
            user
        })
    }
    catch(err){
        console.error('Get Current User error : ', err)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
