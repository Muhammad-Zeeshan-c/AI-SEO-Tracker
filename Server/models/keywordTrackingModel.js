import mongoose from "mongoose";

const rankHistorySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    position: { type: Number, default: null },
    page: { type: Number, default:null },
    title: { type: String, default: '' }, 
    snippet: { type: String, default: '' },
},  );

const competitorSchema = new mongoose.Schema({
    domain: { type: String, required: true },
    position: { type: Number, required:true },
    url: { type: String, required: true },
    title: { type: String, default: '' },
    snippet:{tpe:String,default:''}
});

const keywordTrackingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    },

    keyword:{
        type:String,
        required:true,
        trime:true,
        lowercase:true
    },

    domain:{
        type:String,
        required:true,
    },
    currrentPosition:{
        type:Number,
        default:null
    },
    curretPage:{
        type:Number,
        default:null
    },
    bestPosition:{
        type:Number,
        default:null
    },
    positionChage:{
        type:Number,
        default:null
    },
    rankHistory:[rankHistorySchema],
    competitors:[competitorSchema],
    active:{type:Boolean,default:True},
    lastChecked:{type:Date,default:null},
    status:{type:String,enum:['pending','checking','icompleted','failed'],default:"pending"},

},{timestamps:true})


keywordTrackingSchema.index({userId:1,keyword:1,domain:1},{unique:true})

const keywordTrackingModel = mongoose.model("KeywordTracking", keywordTrackingSchema);

export default keywordTrackingModel;