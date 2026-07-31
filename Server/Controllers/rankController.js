import {trackKeyword} from "../services/keyTrackerService.js";
import keywordTrackingModel from "../models/keywordTrackingModel.js";

export const addKeyword= async (req,res)=>{

    try{
        const {keyword,url}=req.body;
        

        if(!keyword || !url){
            return res.status(400).json({message:"Key word and url are required",success:false})
        }

        let domain;

        //extract domain
        try{
            const urlObj=new URL(url.startsWith("http")?url:`https://${url}`);
            domain=urlObj.hostname.replace("www.","");
        }
        catch(err){
            console.error(err);
            return res.status(400).json({message:"Invalid URL format",success:false})
        }

        //find if already exists
        const existingKeyword=await keywordTrackingModel.findOne({userId:req.userid,keyword:keyword.toLowerCase().trim(),domain:domain});

        if(existingKeyword){
            return res.status(400).json({message:"Keyword already exists for this domain",success:false})
        }

        //Tracking keyword


        const tracking=new keywordTrackingModel({
            userId:req.userid,
            keyword:keyword.toLowerCase().trim(),
            url:url.startsWith("http")?url:`https://${url}`,
            domain:domain,
            status:'checking',

        })

        await tracking.save()

        res.status(201).json({message:"Keyword added successfully",success:true,data:tracking})
        trackKeyword(tracking)
    }
    catch(error){
        console.error("Error adding keyword",error);
        if(error.code===11000){
            return res.status(400).json({message:"Keyword already exists for this domain",success:false})
        }

        return res.status(500).json({message:"Internal server error",success:false})


    }

}


//Get all keywords
export const getKeywords= async (req,res)=>{

    try{
        const keywords=await keywordTrackingModel.find({userId:req.userid}).sort({createdAt:-1}).select('-rankHistory');

        return res.json({message:"Keywords fetched successfully",success:true,data:keywords})
    }
    catch(error){
        console.error("Error fetching keywords",error);
        res.status(500).json({message:"Internal server error",success:false})
    }

}


//Get keyword with its history
export const getKeyword= async (req,res)=>{

    try{
        const keywords=await keywordTrackingModel.findOne({_id:req.params.id})

        if(!keywords){
            return res.status(404).json({message:"Keyword not found",success:false})
        }

        return res.json({message:"Keywords fetched successfully",success:true,data:keywords})
    }
    catch(error){
        console.error("Error fetching keywords",error);
        res.status(500).json({message:"Internal server error",success:false})
    }

}
export const refreshKeyword= async (req,res)=>{

    try{
        const keyword=await keywordTrackingModel.findOne({_id:req.params.id})

        if(!keyword){
            return res.status(404).json({message:"Keyword not found",success:false})
        }
        keyword.status='checking';
        await keyword.save();

        trackKeyword(keyword)

        return res.json({message:"Keyword refreshed successfully",success:true,data:keyword})
    }
    catch(error){
        console.error("Error refreshing keyword",error);
        res.status(500).json({message:"Internal server error",success:false})
    }

}
export const deleteKeyword= async (req,res)=>{

    try{
        const keyword=await keywordTrackingModel.findOneAndDelete({_id:req.params.id,userId:req.userid})

        if(!keyword){
            return res.status(404).json({message:"Keyword not found",success:false})
        }
        
        return res.json({message:"keyword tracking deleted",success:true,data:keyword})
    }
    catch(error){
        console.error("Delete tracking error",error);
        res.status(500).json({message:"Internal server error",success:false})
    }
}

//Toggle Tracking
export const toggleTracking= async (req,res)=>{
    try{
        const tracking=await keywordTrackingModel.findOne({_id:req.params.id,userId:req.userid})

        if(!tracking){
            return res.status(404).json({message:"Keyword tracking not found",success:false})
        }

        tracking.active=!tracking.active;
        await tracking.save()

        return res.status(200).json({message:"Keyword tracking toggled successfully",success:true,data:tracking})

    }
    catch(error){
        console.error('Toggle tracking keyword error',error)
        res.status(500).json({message:"Internal server error",success:false})
    }
}