import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    plan:{
        type:String,
        default:"Free",
        enum:["Free","Pro"]
    },
    analsisCount:{
        type:Number,
        default:0
    },
    lastAnalysisDate:{
        type:Date,
        default:null
    }

},{timestamps:true})

const User=mongoose.model("User",userSchema)

export default User